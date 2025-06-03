import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Mail,
  Calendar,
  Eye,
  RefreshCw,
  FileText,
  Users,
  Copy,
  Check,
} from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const NewsletterGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [newsletterPreview, setNewsletterPreview] = useState("");
  const [newsletterTitle, setNewsletterTitle] = useState("");
  const [recentContent, setRecentContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    comunicati: 0,
    notizie: 0,
    selected: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Imposta il titolo di default
    const currentDate = new Date();
    const monthNames = [
      "GENNAIO",
      "FEBBRAIO",
      "MARZO",
      "APRILE",
      "MAGGIO",
      "GIUGNO",
      "LUGLIO",
      "AGOSTO",
      "SETTEMBRE",
      "OTTOBRE",
      "NOVEMBRE",
      "DICEMBRE",
    ];
    const defaultTitle = `NEWSLETTER SNALV CONFSAL ${
      monthNames[currentDate.getMonth()]
    } ${currentDate.getFullYear()}`;
    setNewsletterTitle(defaultTitle);

    // Carica i contenuti recenti
    loadRecentContent();
  }, []);

  useEffect(() => {
    // Aggiorna statistiche quando cambia la selezione
    setStats((prev) => ({
      ...prev,
      selected: selectedContent.length,
    }));
  }, [selectedContent]);

  // Funzione per caricare contenuti degli ultimi 30 giorni
  const loadRecentContent = async () => {
    setIsLoading(true);
    try {
      // Fetch da entrambe le collezioni
      const [notizieQuery, comunicatiQuery] = await Promise.all([
        getDocs(query(collection(db, "notizie"), orderBy("createdAt", "desc"))),
        getDocs(
          query(collection(db, "comunicati"), orderBy("createdAt", "desc"))
        ),
      ]);

      const notizieData = notizieQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        type: "notizia",
      }));

      const comunicatiData = comunicatiQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        type: "comunicato",
      }));

      // Unisci tutti i contenuti
      const allContent = [...notizieData, ...comunicatiData];

      // Filtra gli ultimi 30 giorni
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recent = allContent
        .filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= thirtyDaysAgo;
        })
        // @ts-ignore
        .sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt));

      setRecentContent(recent);

      // Seleziona tutti di default
      setSelectedContent(recent.map((item) => item.id));

      // Calcola statistiche
      setStats({
        total: recent.length,
        comunicati: recent.filter((item) => item.type === "comunicato").length,
        notizie: recent.filter((item) => item.type === "notizia").length,
        selected: recent.length,
      });
    } catch (error) {
      console.error("Error loading content:", error);

      // Fallback: prova solo collezione notizie
      try {
        const newsQuery = query(
          collection(db, "notizie"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(newsQuery);
        const newsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          type: doc.data().tipo === "comunicato" ? "comunicato" : "notizia",
        }));

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recent = newsData.filter((item) => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= thirtyDaysAgo;
        });

        setRecentContent(recent);
        setSelectedContent(recent.map((item) => item.id));
        setStats({
          total: recent.length,
          comunicati: recent.filter((item) => item.type === "comunicato")
            .length,
          notizie: recent.filter((item) => item.type === "notizia").length,
          selected: recent.length,
        });
      } catch (fallbackError) {
        console.error("Error in fallback:", fallbackError);
        alert("Errore nel caricamento dei contenuti");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Gestione selezione contenuti
  const toggleContentSelection = (contentId) => {
    setSelectedContent((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContent.length === recentContent.length) {
      setSelectedContent([]);
    } else {
      setSelectedContent(recentContent.map((item) => item.id));
    }
  };

  // Funzione per ottenere solo i contenuti selezionati
  const getSelectedContent = () => {
    return recentContent.filter((item) => selectedContent.includes(item.id));
  };

  // Funzione per generare l'HTML della newsletter
  const generateNewsletterHTML = (content, title) => {
    const monthNames = [
      "GENNAIO",
      "FEBBRAIO",
      "MARZO",
      "APRILE",
      "MAGGIO",
      "GIUGNO",
      "LUGLIO",
      "AGOSTO",
      "SETTEMBRE",
      "OTTOBRE",
      "NOVEMBRE",
      "DICEMBRE",
    ];

    const currentDate = new Date();
    const monthYear = `${
      monthNames[currentDate.getMonth()]
    } ${currentDate.getFullYear()}`;

    // Dividi i contenuti in gruppi di 2 per le righe
    const contentRows = [];
    for (let i = 0; i < content.length; i += 2) {
      contentRows.push(content.slice(i, i + 2));
    }

    const generateContentCard = (item) => {
      return `
        <table align="left" border="0" cellpadding="0" cellspacing="0" width="300" class="columnWrapper">
          <tbody><tr>
            <td valign="top" class="columnContainer">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageCardBlock">
                <tbody class="mcnImageCardBlockOuter">
                  <tr>
                    <td class="mcnImageCardBlockInner" valign="top" style="padding-top:9px; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                      <table align="left" border="0" cellpadding="0" cellspacing="0" class="mcnImageCardBottomContent" width="100%" style="background-color: #FFFFFF;">
                        <tbody>
                          <tr>
                            <td class="mcnImageCardBottomImageContent" align="center" valign="top" style="padding-top:0px; padding-right:0px; padding-bottom:0; padding-left:0px;">
                              <img src="${
                                item.coverImage ||
                                "https://via.placeholder.com/264x264?text=SNALV"
                              }" width="264" style="max-width:1000px;width: 264px;height: 264px;" class="mcnImage">
                            </td>
                          </tr>
                          <tr>
                            <td class="mcnTextContent" valign="top" style="padding: 9px 18px;color: #222222;font-family: Helvetica;font-size: 14px;font-weight: normal;text-align: left;" width="246">
                              <div style="display: inline-block; background: ${
                                item.type === "comunicato"
                                  ? "#e3f2fd"
                                  : "#f3e5f5"
                              }; color: ${
        item.type === "comunicato" ? "#1976d2" : "#7b1fa2"
      }; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">
                                ${
                                  item.type === "comunicato"
                                    ? "Comunicato"
                                    : "Notizia"
                                }
                              </div><br>
                              ${item.title}
                            </td>
                          </tr>
                          <tr>
                            <td class="mcnTextContent" valign="top" style="padding: 9px 18px;color: #222222;font-family: Helvetica;font-size: 10px;font-weight: normal;text-align: left;" width="246">
                              ${
                                item.content
                                  ? item.content.substring(0, 100) + "..."
                                  : "Leggi il contenuto completo..."
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a href="https://snalv.it/${
                                item.linkNews
                              }?utm_source=brevo&utm_campaign=NEWSLETTER SNALV CONFSAL ${monthYear}&utm_medium=email" target="_blank" style="margin-left: 80%;display: block;margin-bottom: 10px;color: #1f2d3d;">Leggi</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr></tbody>
        </table>`;
    };

    const generateContentRow = (contentItems) => {
      return `
        <tr><td valign="top" id="templateColumns">
          ${contentItems.map((item) => generateContentCard(item)).join("")}
        </td></tr>`;
    };

    return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="format-detection" content="telephone=no">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style type="text/css" emogrify="no">
#outlook a {padding:0;} 
.ExternalClass {width:100%;} 
.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } 
table td { border-collapse: collapse; mso-line-height-rule: exactly; } 
.editable.image { font-size: 0 !important; line-height: 0 !important; } 
.nl2go_preheader { display: none !important; mso-hide:all !important; mso-line-height-rule: exactly; visibility: hidden !important; line-height: 0px !important; font-size: 0px !important; } 
body { width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; } 
img { outline:none; text-decoration:none; -ms-interpolation-mode: bicubic; } 
a img {border:none;} 
table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; } 
th { font-weight: normal; text-align: left; } 
*[class="gmail-fix"] { display: none !important; }
@media (max-width: 600px) { 
  .gmx-killpill { content: ' \\03D1';} 
  .r0-c { box-sizing: border-box !important; text-align: center !important; valign: top !important; width: 320px !important } 
  .r1-o { border-style: solid !important; margin: 0 auto 0 auto !important; width: 320px !important } 
  .r2-c { box-sizing: border-box !important; text-align: center !important; valign: top !important; width: 100% !important } 
  .r3-o { border-style: solid !important; margin: 0 auto 0 auto !important; width: 100% !important } 
  .columnWrapper { width: 100% !important; } 
  .mcnImageCardBlock { width: 100% !important; } 
}
</style>
<style type="text/css">
p, h1, h2, h3, h4, ol, ul { margin: 0; } 
a, a:link { color: #0092ff; text-decoration: underline } 
.nl2go-default-textstyle { color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5 } 
.default-button { border-radius: 4px; color: #ffffff; font-family: arial,helvetica,sans-serif; font-size: 16px; font-style: normal; font-weight: normal; line-height: 1.15; text-decoration: none; width: 50% } 
.default-heading1 { color: #1F2D3D; font-family: arial,helvetica,sans-serif; font-size: 36px } 
.default-heading2 { color: #1F2D3D; font-family: arial,helvetica,sans-serif; font-size: 32px } 
.default-heading3 { color: #1F2D3D; font-family: arial,helvetica,sans-serif; font-size: 24px } 
.default-heading4 { color: #1F2D3D; font-family: arial,helvetica,sans-serif; font-size: 18px } 
a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; } 
.no-show-for-you { border: none; display: none; float: none; font-size: 0; height: 0; line-height: 0; max-height: 0; mso-hide: all; overflow: hidden; table-layout: fixed; visibility: hidden; width: 0; }
</style>
</head>
<body text="#3b3f44" link="#0092ff" yahoo="fix" style="">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" class="nl2go-body-table" width="100%" style="width: 100%;">
<tbody>
<tr>
<td align="center" class="r0-c">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="600" class="r1-o" style="table-layout: fixed; width: 600px;">
<tbody>
<tr>
<td valign="top" class="">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<td class="r2-c" align="center">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r3-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td class="r4-i" style="background-color: #ffffff; padding-bottom: 20px; padding-top: 20px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<th width="100%" valign="top" class="r5-c" style="font-weight: normal;">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td valign="top" class="r7-i" style="padding-left: 15px; padding-right: 15px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<td class="r8-c" align="left">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r9-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td align="center" valign="top" class="r10-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; padding-top: 15px; text-align: center;">
<div><h1 class="default-heading1" style="margin: 0; color: #1f2d3d; font-family: arial,helvetica,sans-serif; font-size: 36px;"><span style="font-size: 16px;">${title}</span></h1></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="r2-c" align="center">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="570" class="r11-o" style="table-layout: fixed; width: 570px;">
<tbody>
<tr>
<td class="r12-i" style="font-size: 0px; line-height: 0px; padding-bottom: 15px; padding-top: 15px;">
<img src="https://img.mailinblue.com/5671625/images/content_library/original/63e4fb0a033dee34b919e873.png" width="570" border="0" class="" style="display: block; width: 100%;">
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</th>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="r2-c" align="center">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r3-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td class="r4-i" style="background-color: #ffffff; padding-bottom: 20px; padding-top: 20px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<th width="100%" valign="top" class="r5-c" style="font-weight: normal;">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td valign="top" class="r7-i" style="padding-left: 10px; padding-right: 10px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<td class="r8-c" align="left">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r9-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td align="center" valign="top" class="r13-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; padding-bottom: 15px; padding-top: 15px; text-align: center;">
<div>
<p style="margin: 0;">"Con la newsletter di ${monthYear.toLowerCase()}, auguriamo a tutti una buona continuazione delle attività.<br>Ci aspetta una fase importante di riorganizzazione, con tante nuove sfide alle porte.<br>Che sia un periodo di crescita e di traguardi comuni. Buon lavoro a tutti!"</p>
<p style="margin: 0;"> </p>
<p style="margin: 0;">Il Segretario Generale Nazionale<br><strong>Dott.ssa Maria Mamone</strong></p>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="r8-c" align="left">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r9-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td align="center" valign="top" class="r10-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; padding-top: 15px; text-align: center;">
<div><h2 class="default-heading2" style="margin: 0; color: #1f2d3d; font-family: arial,helvetica,sans-serif; font-size: 32px;"><span style="font-size: 18px;font-weight: 700;">COMUNICATI STAMPA E NOTIZIE</span></h2></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</th>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>

${contentRows.map((row) => generateContentRow(row)).join("")}

<tr>
<td class="r2-c" align="center">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r3-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td class="r15-i" style="background-color: #ffffff; padding-bottom: 20px; padding-top: 20px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<th width="100%" valign="top" class="r5-c" style="font-weight: normal;">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td valign="top" class="r7-i" style="padding-left: 15px; padding-right: 15px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<td class="r25-c" align="center">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="570" class="r3-o" style="table-layout: fixed; width: 570px;">
<tbody>
<tr>
<td valign="top" class="">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<td class="r26-c" style="display: inline-block;">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="570" class="r6-o" style="table-layout: fixed; width: 570px;">
<tbody>
<tr>
<td class="r27-i" style="padding-bottom: 15px; padding-left: 209px; padding-right: 209px; padding-top: 15px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<th width="40" valign="" class="r28-c mobshow resp-table" style="font-weight: normal;">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r29-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td class="r30-i" style="font-size: 0px; line-height: 0px; padding-bottom: 5px; padding-top: 5px;">
<a href="https://www.facebook.com/snalvconfsal?utm_source=brevo&utm_campaign=NEWSLETTER SNALV CONFSAL ${monthYear}&utm_medium=email" target="_blank"><img src="https://sendinblue-templates.s3.eu-west-3.amazonaws.com/icons/rounded_colored/facebook_32px.png" width="32" border="0" class="" style="display: block; width: 100%;"></a>
</td>
<td class="nl2go-responsive-hide" width="8" style="font-size: 0px; line-height: 1px;">&shy; </td>
</tr>
</tbody>
</table>
</th>
<th width="40" valign="" class="r28-c mobshow resp-table" style="font-weight: normal;">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r29-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td class="r30-i" style="font-size: 0px; line-height: 0px; padding-bottom: 5px; padding-top: 5px;">
<a href="https://twitter.com/SnalvConfsal?utm_source=brevo&utm_campaign=NEWSLETTER SNALV CONFSAL ${monthYear}&utm_medium=email" target="_blank"><img src="https://sendinblue-templates.s3.eu-west-3.amazonaws.com/icons/rounded_colored/twitter_32px.png" width="32" border="0" class="" style="display: block; width: 100%;"></a>
</td>
<td class="nl2go-responsive-hide" width="8" style="font-size: 0px; line-height: 1px;">&shy; </td>
</tr>
</tbody>
</table>
</th>
<th width="40" valign="" class="r28-c mobshow resp-table" style="font-weight: normal;">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r29-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td class="r30-i" style="font-size: 0px; line-height: 0px; padding-bottom: 5px; padding-top: 5px;">
<a href="https://www.instagram.com/snalvconfsal/?utm_source=brevo&utm_campaign=NEWSLETTER SNALV CONFSAL ${monthYear}&utm_medium=email" target="_blank"><img src="https://sendinblue-templates.s3.eu-west-3.amazonaws.com/icons/rounded_colored/instagram_32px.png" width="32" border="0" class="" style="display: block; width: 100%;"></a>
</td>
<td class="nl2go-responsive-hide" width="8" style="font-size: 0px; line-height: 1px;">&shy; </td>
</tr>
</tbody>
</table>
</th>
<th width="40" valign="" class="r28-c mobshow resp-table" style="font-weight: normal;">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r29-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td class="r30-i" style="font-size: 0px; line-height: 0px; padding-bottom: 5px; padding-top: 5px;">
<a href="https://www.youtube.com/channel/UCRFXqyjM9XOjYbkGqMf91og?utm_source=brevo&utm_campaign=NEWSLETTER SNALV CONFSAL ${monthYear}&utm_medium=email" target="_blank"><img src="https://sendinblue-templates.s3.eu-west-3.amazonaws.com/icons/rounded_colored/youtube_32px.png" width="32" border="0" class="" style="display: block; width: 100%;"></a>
</td>
<td class="nl2go-responsive-hide" width="8" style="font-size: 0px; line-height: 1px;">&shy; </td>
</tr>
</tbody>
</table>
</th>
<th width="32" valign="" class="r28-c mobshow resp-table" style="font-weight: normal;">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r31-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td class="r30-i" style="font-size: 0px; line-height: 0px; padding-bottom: 5px; padding-top: 5px;">
<a href="https://www.linkedin.com/in/snalv/?utm_source=brevo&utm_campaign=NEWSLETTER SNALV CONFSAL ${monthYear}&utm_medium=email" target="_blank"><img src="https://sendinblue-templates.s3.eu-west-3.amazonaws.com/icons/rounded_colored/linkedin_32px.png" width="32" border="0" class="" style="display: block; width: 100%;"></a>
</td>
</tr>
</tbody>
</table>
</th>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</th>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="r2-c" align="center">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r3-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td class="r32-i" style="background-color: #eff2f7; padding-bottom: 20px; padding-top: 20px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<th width="100%" valign="top" class="r5-c" style="font-weight: normal;">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td valign="top" class="r7-i" style="padding-left: 15px; padding-right: 15px;">
<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
<tbody>
<tr>
<td class="r8-c" align="left">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r9-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td align="center" valign="top" class="r33-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 18px; line-height: 1.5; padding-top: 15px; text-align: center;">
<div><p style="margin: 0;"><strong>SNALV CONFSAL</strong><br><strong>Copyright 2024 @ All rights reserved.</strong></p><p style="margin: 0;"> </p></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="r8-c" align="left">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r9-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td align="center" valign="top" class="r34-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 18px; line-height: 1.5; text-align: center;">
<div><p style="margin: 0; font-size: 14px;">Via di Porta Maggiore, 9, 00185, Roma</p></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="r8-c" align="left">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r9-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td align="center" valign="top" class="r33-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 18px; line-height: 1.5; padding-top: 15px; text-align: center;">
<div><p style="margin: 0; font-size: 14px;">Questa e-mail e' stata inviata da SNALV CONFSAL</p></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="r8-c" align="left">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r9-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td align="center" valign="top" class="r34-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 18px; line-height: 1.5; text-align: center;">
<div><p style="margin: 0; font-size: 14px;">Hai ricevuto questa e-mail perche' vi siete iscritti alla nostra newsletter.</p></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="r8-c" align="left">
<table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r9-o" style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td align="center" valign="top" class="r13-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 18px; line-height: 1.5; padding-bottom: 15px; padding-top: 15px; text-align: center;">
<div><p style="margin: 0; font-size: 10px;">
Visualizza <a href="https://snalv.it/privacy-policy?utm_source=brevo&utm_campaign=NEWSLETTER SNALV CONFSAL ${monthYear}&utm_medium=email" style="color: #0092ff; text-decoration: underline;">qui</a> l'informativa privacy completa <br>
Snalv Confsal, in qualità di titolare del trattamento, Le ricorda che i Suoi dati personali sono trattati nel rispetto del Regolamento UE 2016/679 GDPR per l'invio di comunicazioni inerenti ai propri servizi istituzionali. La base giuridica del trattamento, ove non basata sull'espresso consenso dell'Interessato, sarà fondata sul legittimo interesse del Titolare. Per prendere visione dell'informativa completa resa ai sensi dell'art. 13 del Regolamento UE 2016/679 GDPR, clicca <a href="https://snalv.it/privacy-policy?utm_source=brevo&utm_campaign=NEWSLETTER SNALV CONFSAL ${monthYear}&utm_medium=email" style="color: #0092ff; text-decoration: underline;">qui</a> <br> 
<a href="{{ unsubscribe }}" style="color: #0092ff; text-decoration: underline;">Annulla iscrizione</a></p></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</th>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</body>
</html>`;
  };

  // Funzione per scaricare l'HTML
  const downloadHTML = () => {
    const selectedContentData = getSelectedContent();
    if (selectedContentData.length === 0) {
      alert("Seleziona almeno un contenuto per generare la newsletter");
      return;
    }

    const html = generateNewsletterHTML(selectedContentData, newsletterTitle);

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Funzione per copiare l'HTML
  const copyHTML = async () => {
    const selectedContentData = getSelectedContent();
    if (selectedContentData.length === 0) {
      alert("Seleziona almeno un contenuto per generare la newsletter");
      return;
    }

    const html = generateNewsletterHTML(selectedContentData, newsletterTitle);

    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Errore nella copia:", error);
      alert("Errore nella copia dell'HTML");
    }
  };

  // Funzione per generare anteprima
  const generatePreview = () => {
    const selectedContentData = getSelectedContent();
    if (selectedContentData.length === 0) {
      alert("Seleziona almeno un contenuto per generare l'anteprima");
      return;
    }

    const html = generateNewsletterHTML(selectedContentData, newsletterTitle);
    setNewsletterPreview(html);
    setShowPreviewDialog(true);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Generatore Newsletter SNALV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sezione Statistiche - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-blue-900">
                      {stats.total}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-700">
                      Disponibili
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Check className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-green-900">
                      {stats.selected}
                    </div>
                    <div className="text-xs sm:text-sm text-green-700">
                      Selezionati
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-indigo-900">
                      {stats.comunicati}
                    </div>
                    <div className="text-xs sm:text-sm text-indigo-700">
                      Comunicati
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-purple-900">
                      {stats.notizie}
                    </div>
                    <div className="text-xs sm:text-sm text-purple-700">
                      Notizie
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sezione Configurazione */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 text-base sm:text-lg">
                Configurazione Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newsletter-title" className="text-sm">
                  Titolo Newsletter
                </Label>
                <Input
                  id="newsletter-title"
                  value={newsletterTitle}
                  onChange={(e) => setNewsletterTitle(e.target.value)}
                  placeholder="Es: NEWSLETTER SNALV CONFSAL GENNAIO 2024"
                  className="border-green-300 focus:border-green-500 text-sm"
                />
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Periodo automatico: Ultimi 30 giorni</span>
              </div>
            </CardContent>
          </Card>

          {/* Selezione Contenuti */}
          {stats.total > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-base sm:text-lg">
                    Seleziona Contenuti ({stats.selected}/{stats.total})
                  </CardTitle>
                  <Button
                    onClick={toggleSelectAll}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-xs"
                  >
                    {selectedContent.length === recentContent.length
                      ? "Deseleziona Tutti"
                      : "Seleziona Tutti"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 sm:h-64">
                  <div className="space-y-2">
                    {recentContent.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-2 sm:p-3 rounded border hover:bg-gray-50"
                      >
                        <Checkbox
                          checked={selectedContent.includes(item.id)}
                          onCheckedChange={() =>
                            toggleContentSelection(item.id)
                          }
                          className="mt-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 flex-shrink-0">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                                item.type === "comunicato"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {item.type === "comunicato"
                                ? "Comunicato"
                                : "Notizia"}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                          <span className="text-sm block break-words">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Azioni Principali - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              onClick={loadRecentContent}
              disabled={isLoading}
              variant="outline"
              className="flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Caricamento..." : "Aggiorna"}
            </Button>

            <Button
              onClick={generatePreview}
              disabled={isLoading || stats.selected === 0}
              variant="outline"
              className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-sm"
            >
              <Eye className="h-4 w-4" />
              Anteprima
            </Button>

            <Button
              onClick={copyHTML}
              disabled={isLoading || stats.selected === 0}
              variant="outline"
              className={`flex items-center justify-center gap-2 text-sm ${
                copied
                  ? "bg-green-50 text-green-700"
                  : "bg-orange-50 hover:bg-orange-100"
              }`}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copiato!" : "Copia HTML"}
            </Button>

            <Button
              onClick={downloadHTML}
              disabled={isLoading || stats.selected === 0}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-sm"
            >
              <Download className="h-4 w-4" />
              Scarica HTML
            </Button>
          </div>

          {/* Messaggio se nessun contenuto */}
          {stats.total === 0 && !isLoading && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 sm:p-6 text-center">
                <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-base sm:text-lg font-medium text-yellow-800 mb-2">
                  Nessun contenuto trovato
                </h3>
                <p className="text-yellow-700 text-xs sm:text-sm">
                  Non ci sono comunicati o notizie pubblicati negli ultimi 30
                  giorni. Prova a ricaricare o verifica che ci siano contenuti
                  nel database.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Dialog Anteprima - Mobile Responsive */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full p-3 sm:p-6">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-base sm:text-lg">
              Anteprima Newsletter
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 h-full">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={downloadHTML}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-sm"
              >
                <Download className="h-4 w-4" />
                Scarica HTML
              </Button>
              <Button
                onClick={copyHTML}
                variant="outline"
                className={`flex items-center justify-center gap-2 text-sm ${
                  copied ? "bg-green-50 text-green-700" : ""
                }`}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copiato!" : "Copia HTML"}
              </Button>
              <Button
                onClick={generatePreview}
                variant="outline"
                className="flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Aggiorna
              </Button>
            </div>

            <div
              className="border rounded-lg overflow-hidden"
              style={{ height: "calc(95vh - 180px)" }}
            >
              {newsletterPreview && (
                <iframe
                  srcDoc={newsletterPreview}
                  className="w-full h-full border-0"
                  title="Newsletter Preview"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewsletterGenerator;
