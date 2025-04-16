import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    // Inizializza Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Estrai i dati dal form
    const formData = await request.formData();

    // Gestione dei file allegati
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

    // Estrai i campi del form
    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const area = formData.get("area");
    const message = formData.get("message");

    // Determina i destinatari in base all'area selezionata
    let recipients = [];
    if (area === "ATA") {
      recipients = ["ata@snalv.it"];
    } else if (area === "DOCENTI") {
      recipients = ["docenti@snalv.it"];
    } else if (area === "ALTRO") {
      recipients = ["ata@snalv.it", "docenti@snalv.it"];
    } else {
      // Fallback se non è specificata un'area
      recipients = ["info@snalv.it"];
    }

    // Crea l'oggetto dell'email in base all'area
    let subject = "Nuovo contatto dal sito SNALV";
    if (area === "ATA") {
      subject = `Contatto dal sito - Area ATA - ${name}`;
    } else if (area === "DOCENTI") {
      subject = `Contatto dal sito - Area DOCENTI - ${name}`;
    } else if (area === "ALTRO") {
      subject = `Contatto dal sito - Area ALTRO - ${name}`;
    }

    // Prepara il contenuto HTML dell'email
    const emailHtml = `
      <h2>Nuovo messaggio dal form di contatto Scuola</h2>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; width: 30%;"><strong>Nome:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefono:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Area:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${area}</td>
        </tr>
      </table>
      
      <div style="margin-top: 20px;">
        <h3>Messaggio:</h3>
        <div style="padding: 15px; background-color: #f5f5f5; border-radius: 4px; border-left: 4px solid #c00000;">
          ${message?.toString().replace(/\n/g, "<br>")}
        </div>
      </div>
    `;

    // Crea un allegato JSON con tutti i dati
    const jsonData = JSON.stringify(
      {
        name,
        phone,
        email,
        area,
        message,
      },
      null,
      2
    );

    // Invia email con Resend
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: recipients,
      subject: subject,
      html: emailHtml,
      attachments: [
        {
          filename: "dati-richiesta.json",
          content: jsonData,
        },
        ...attachments,
      ],
      headers: {
        "X-Request-Type": "scuola",
        "X-Area": String(area),
        "X-Data-Richiesta": new Date().toISOString(),
      },
    });

    console.log("Email inviata con successo:", result);

    // Invia conferma all'utente se è stata fornita un'email
    if (email) {
      try {
        const confirmationText = `
          Gentile ${name},
          
          Abbiamo ricevuto la tua richiesta di contatto per l'area ${area}.
          I nostri Coordinatori Nazionali la esamineranno e ti contatteranno al più presto.
          
          Cordiali saluti,
          SNALV Confsal
        `;

        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: [String(email)],
          subject: "Richiesta di contatto ricevuta - SNALV Confsal",
          text: confirmationText,
        });
      } catch (confirmError) {
        console.warn(
          "Non è stato possibile inviare l'email di conferma:",
          confirmError
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: result.data,
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
  }
}
