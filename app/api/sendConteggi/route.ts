import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const createTransporter = async () => {
  const cleanEmail = process.env.EMAIL_USER?.replace(/[",\s]/g, "");

  const config = {
    host: "smtps.aruba.it",
    port: 465,
    secure: true,
    auth: {
      user: cleanEmail,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  const transporter = nodemailer.createTransport(config);

  try {
    await transporter.verify();
    console.log("Connessione al server SMTP verificata con successo");
    return transporter;
  } catch (error) {
    console.error("Errore nella verifica della connessione SMTP:", error);
    throw error;
  }
};

export async function POST(request: Request) {
  let transporter;

  try {
    const formData = await request.formData();

    const files = formData.getAll("files");
    const attachments = [];

    for (const file of files) {
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        attachments.push({
          filename: file.name,
          content: buffer,
        });
      }
    }

    const formFields = {
      ragioneSociale: formData.get("ragioneSociale"),
      cellulare: formData.get("cellulare"),
      dataInizio: formData.get("dataInizio"),
      ccnl: formData.get("ccnl"),
      tipologiaContratto: formData.get("tipologiaContratto"),
      straordinari: formData.get("straordinari"),
      lavoratore: formData.get("lavoratore"),
      email: formData.get("email"),
      dataFine: formData.get("dataFine"),
      retribuzione: formData.get("retribuzione"),
      orarioLavoro: formData.get("orarioLavoro"),
      oreSettimanali: formData.get("oreSettimanali"),
    };

    const emailContent = `
      Nuova richiesta di conteggi:

      Dati Aziendali:
      Ragione sociale/Datore di lavoro: ${formFields.ragioneSociale}
      CCNL applicato: ${formFields.ccnl}

      Dati Lavoratore:
      Nome: ${formFields.lavoratore}
      Email: ${formFields.email}
      Cellulare: ${formFields.cellulare}

      Dettagli Contratto:
      Data inizio: ${formFields.dataInizio}
      Data fine: ${formFields.dataFine}
      Tipologia contratto: ${formFields.tipologiaContratto}
      Retribuzione: ${formFields.retribuzione}
      Orario di lavoro: ${formFields.orarioLavoro}
      Ore settimanali: ${formFields.oreSettimanali}
      Straordinari: ${formFields.straordinari || "Non specificati"}
    `;

    const jsonAttachment = {
      filename: "dati-richiesta.json",
      content: Buffer.from(JSON.stringify(formFields, null, 2)),
      contentType: "application/json",
    };
    attachments.push(jsonAttachment);

    transporter = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Nuova richiesta di conteggi - ${formFields.lavoratore}`,
      text: emailContent,
      attachments: attachments,

      headers: {
        "X-Request-Type": "conteggi",
        "X-Lavoratore": formFields.lavoratore,
        "X-Data-Richiesta": new Date().toISOString(),
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email inviata con successo:", info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Errore nell'elaborazione della richiesta:", error);
    return NextResponse.json(
      {
        error: "Errore durante l'invio della richiesta",
        details: error instanceof Error ? error.message : "Errore sconosciuto",
      },
      { status: 500 }
    );
  } finally {
    if (transporter) {
      try {
        await transporter.close();
      } catch (closeError) {
        console.error("Errore nella chiusura della connessione:", closeError);
      }
    }
  }
}
