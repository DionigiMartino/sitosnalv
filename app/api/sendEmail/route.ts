// app/api/sendEmail/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configurazione per estendere il timeout della risposta API
export const maxDuration = 60; // estendi a 60 secondi

export async function POST(request: Request) {
  let transporter;

  try {
    const data = await request.json();

    // Validazione base
    if (!data.nome || !data.cognome) {
      return NextResponse.json(
        { error: "Dati obbligatori mancanti" },
        { status: 400 }
      );
    }

    // Configurazione email con timeout esteso
    transporter = nodemailer.createTransport({
      host: "smtps.aruba.it",
      port: 465,
      secure: true,
      connectionTimeout: 15000, // 15 secondi di timeout per la connessione
      socketTimeout: 30000, // 30 secondi di timeout per il socket
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Preparazione contenuto email
    const emailContent = `
      Nuova richiesta di certificato:
      Nome: ${data.nome || "Non specificato"}
      Cognome: ${data.cognome || "Non specificato"}
      Email: ${data.email || "Non specificato"}
      Telefono: ${data.telefono || "Non specificato"}
      
      Altri dettagli:
      Luogo di nascita: ${data.luogoNascita || "Non specificato"}
      Data di nascita: ${data.dataNascita || "Non specificato"}
      Codice Fiscale: ${data.codiceFiscale || "Non specificato"}
      Qualifica: ${data.qualificaProfessionale || "Non specificato"}
      Datore di lavoro: ${data.datoreLavoro || "Non specificato"}
      Indirizzo lavoro: ${data.indirizzoLavoro || "Non specificato"}
    `;

    // Opzioni email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `Richiesta certificato da ${data.nome} ${data.cognome}`,
      text: emailContent,
    };

    // Invio con gestione errori migliorata
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email inviata con successo:", info.messageId);
      return NextResponse.json({ success: true });
    } catch (sendError) {
      console.error("Errore specifico nell'invio dell'email:", sendError);

      // Restituisci un errore specifico in base al tipo di problema
      if (sendError.code === "ETIMEDOUT") {
        return NextResponse.json(
          { error: "Timeout nella connessione al server email" },
          { status: 504 }
        );
      } else if (sendError.code === "EAUTH") {
        return NextResponse.json(
          { error: "Errore di autenticazione con il server email" },
          { status: 401 }
        );
      }

      throw sendError;
    }
  } catch (error) {
    console.error("Errore generale:", error);
    return NextResponse.json(
      { error: "Errore durante l'elaborazione della richiesta" },
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
