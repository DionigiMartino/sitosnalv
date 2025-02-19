// app/api/send-collaborazione/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    // Inizializza Resend
    const resend = new Resend("re_iajxEGhh_Evm1kP9vhB9RPeiL53r6VDgY");

    // Ottieni i dati dalla richiesta
    const data = await request.json();
    const { nome, cognome, professione, domicilio, cellulare, email } = data;

    // Validazione basilare
    if (!nome || !cognome || !email || !cellulare) {
      return NextResponse.json(
        { error: "Dati obbligatori mancanti" },
        { status: 400 }
      );
    }

    // Contenuto email per lo staff
    const staffEmailContent = `
      Nuova richiesta di collaborazione:

      Dati Personali:
      Nome: ${nome}
      Cognome: ${cognome}
      Professione attuale: ${professione || "Non specificata"}
      Domicilio: ${domicilio || "Non specificato"}

      Contatti:
      Cellulare: ${cellulare}
      Email: ${email}

      Data richiesta: ${new Date().toLocaleString("it-IT")}
    `;

    // Invia email allo staff
    const staffResult = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["sitosnalv@gmail.com"],
      subject: `Nuova richiesta di collaborazione - ${nome} ${cognome}`,
      text: staffEmailContent,
      headers: {
        "X-Request-Type": "collaboration",
        "X-Applicant-Name": `${nome} ${cognome}`,
        "X-Applicant-Location": domicilio || "Non specificato",
      },
    });

    console.log("Email di notifica inviata:", staffResult);

    // Email di conferma al candidato
    const candidateEmailContent = `
      Gentile ${nome} ${cognome},

      Grazie per il tuo interesse a collaborare con SNALV Confsal.

      Abbiamo ricevuto la tua richiesta di collaborazione e la valuteremo con attenzione.
      Ti contatteremo presto al numero ${cellulare} per discutere delle opportunità disponibili nella tua zona (${
      domicilio || "specificata"
    }).

      Ecco un riepilogo dei dati che ci hai fornito:
      - Professione attuale: ${professione || "Non specificata"}
      - Domicilio: ${domicilio || "Non specificato"}
      - Contatti: ${cellulare}, ${email}

      Se nel frattempo hai domande, non esitare a contattarci.

      Cordiali saluti,
      SNALV Confsal
    `;

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [email],
        subject:
          "Abbiamo ricevuto la tua richiesta di collaborazione - SNALV Confsal",
        text: candidateEmailContent,
      });
    } catch (confirmError) {
      console.warn(
        "Non è stato possibile inviare l'email di conferma al candidato:",
        confirmError
      );
      // Continuiamo comunque, l'email allo staff è stata inviata
    }

    return NextResponse.json({
      success: true,
      message: "Richiesta inviata con successo",
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
