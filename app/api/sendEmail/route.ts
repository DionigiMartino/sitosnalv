// app/api/sendEmail/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    // Inizializza Resend con la tua API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Ottieni i dati dalla richiesta
    const data = await request.json();

    // Validazione basilare
    if (!data.nome || !data.cognome || !data.email) {
      return NextResponse.json(
        { error: "Dati obbligatori mancanti" },
        { status: 400 }
      );
    }

    // Prepara il contenuto dell'email
    const emailContent = `
      Nuova richiesta di certificato:

      Dati Anagrafici: 
      Nome: ${data.nome || "Non specificato"}
      Cognome: ${data.cognome || "Non specificato"}
      Luogo di nascita: ${data.luogoNascita || "Non specificato"}
      Data di nascita: ${data.dataNascita || "Non specificato"}
      Codice Fiscale: ${data.codiceFiscale || "Non specificato"}

      Dati di Lavoro:
      Qualifica professionale: ${
        data.qualificaProfessionale || "Non specificato"
      }
      Datore di Lavoro: ${data.datoreLavoro || "Non specificato"}
      Indirizzo sede di lavoro: ${data.indirizzoLavoro || "Non specificato"}

      Dati di contatto:
      Email: ${data.email || "Non specificato"}
      Telefono: ${data.telefono || "Non specificato"}
    `;

    // Invia email usando l'indirizzo predefinito di Resend
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["sitosnalv@gmail.com"],
      subject: `Nuova richiesta certificato - ${data.nome} ${data.cognome}`,
      text: emailContent,
      replyTo: data.email,
    });

    console.log("Email inviata:", result);

    // Invia email di conferma all'utente

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error);

    return NextResponse.json(
      {
        error: "Errore durante l'invio dell'email",
        details: error instanceof Error ? error.message : "Errore sconosciuto",
      },
      { status: 500 }
    );
  }
}
