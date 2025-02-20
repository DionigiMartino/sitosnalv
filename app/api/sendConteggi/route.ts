// app/api/send-conteggi/route.ts
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

    // Prepara il contenuto dell'email
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

    // Crea un allegato JSON con tutti i dati
    const jsonData = JSON.stringify(formFields, null, 2);

    // Invia email con Resend
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["sitosnalv@gmail.com"],
      subject: `Nuova richiesta di conteggi - ${formFields.lavoratore}`,
      text: emailContent,
      attachments: [
        {
          filename: "dati-richiesta.json",
          content: jsonData,
        },
        // Aggiungi tutti gli altri allegati
        ...attachments,
      ],
      headers: {
        "X-Request-Type": "conteggi",
        "X-Lavoratore": String(formFields.lavoratore),
        "X-Data-Richiesta": new Date().toISOString(),
      },
    });

    console.log("Email inviata con successo:", result);

    // Invia conferma all'utente se è stata fornita un'email
    if (formFields.email) {
      try {
        const confirmationText = `
          Gentile ${formFields.lavoratore},
          
          Abbiamo ricevuto la tua richiesta di conteggi.
          I nostri esperti la esamineranno e ti contatteranno al più presto.
          
          Cordiali saluti,
          SNALV Confsal
        `;

        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: [String(formFields.email)],
          subject: "Richiesta di conteggi ricevuta - SNALV Confsal",
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
