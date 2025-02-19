// app/api/sendEmail/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Estendi il timeout per permettere più tentativi
export const maxDuration = 60;

// Numero massimo di tentativi per l'invio email
const MAX_RETRIES = 3;

export async function POST(request: Request) {
  let transporter;

  try {
    console.log("Inizio elaborazione richiesta email");

    // Parsing dei dati con gestione errori
    let data;
    try {
      data = await request.json();
      console.log("Dati ricevuti correttamente");
    } catch (parseError) {
      console.error("Errore nel parsing JSON:", parseError);
      return NextResponse.json(
        { error: "Formato dati non valido" },
        { status: 400 }
      );
    }

    // Validazione basilare
    if (!data.nome || !data.cognome || !data.email) {
      return NextResponse.json(
        { error: "Dati obbligatori mancanti" },
        { status: 400 }
      );
    }

    // Configurazione per la porta 587 (alternativa a 465 che potrebbe essere bloccata)
    transporter = nodemailer.createTransport({
      host: "smtp.aruba.it",
      port: 587,
      secure: false, // false per TLS - STARTTLS
      requireTLS: true, // forza l'uso di TLS
      auth: {
        user: "socioassistenziale@snalv.it",
        pass: "anaste18",
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1",
      },
    });

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

    // Configura le opzioni dell'email
    const mailOptions = {
      from: "socioassistenziale@snalv.it",
      to: process.env.EMAIL_TO || "socioassistenziale@snalv.it",
      subject: `Richiesta certificato - ${data.nome} ${data.cognome}`,
      text: emailContent,
    };

    // Funzione per ritentare l'invio in caso di timeout
    async function attemptSendMail(retry = 0) {
      try {
        console.log(`Tentativo di invio email: ${retry + 1}/${MAX_RETRIES}`);
        const info = await transporter.sendMail(mailOptions);
        console.log("Email inviata con successo:", info.messageId);
        return info;
      } catch (error) {
        console.error(
          `Errore nel tentativo ${retry + 1}:`,
          error.code,
          error.message
        );

        if (
          retry < MAX_RETRIES - 1 &&
          (error.code === "ETIMEDOUT" ||
            error.code === "ESOCKET" ||
            error.code === "ECONNECTION" ||
            error.code === "ECONNRESET")
        ) {
          // Attendi un po' prima di riprovare (backoff esponenziale)
          const delay = Math.pow(2, retry) * 1000; // 1s, 2s, 4s, ...
          console.log(`Riprovo tra ${delay}ms...`);
          await new Promise((r) => setTimeout(r, delay));
          return attemptSendMail(retry + 1);
        }
        throw error;
      }
    }

    // Esegui l'invio con tentativi multipli
    const info = await attemptSendMail();

    // Invia anche una conferma all'utente se possibile
    try {
      if (data.email) {
        const confirmationText = `
          Gentile ${data.nome} ${data.cognome},
          
          Abbiamo ricevuto la tua richiesta di certificato assicurativo.
          Un nostro operatore la elaborerà al più presto.
          
          Cordiali saluti,
          SNALV Confsal
        `;

        await transporter.sendMail({
          from: "socioassistenziale@snalv.it",
          to: data.email,
          subject: "Richiesta certificato ricevuta - SNALV Confsal",
          text: confirmationText,
        });
      }
    } catch (confirmError) {
      // Se l'email di conferma fallisce, ignoriamo l'errore
      console.warn(
        "Non è stato possibile inviare l'email di conferma:",
        confirmError.message
      );
    }

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Errore generale:", error);

    let errorMessage = "Errore durante l'invio dell'email";
    let statusCode = 500;

    if (error.code === "EAUTH") {
      errorMessage = "Errore di autenticazione con il server email";
      statusCode = 401;
    } else if (error.code === "EENVELOPE") {
      errorMessage = "Errore con gli indirizzi email (mittente o destinatario)";
      statusCode = 400;
    } else if (error.code === "ETIMEDOUT" || error.code === "ESOCKET") {
      errorMessage = "Timeout nella connessione al server email";
      statusCode = 504;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
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
