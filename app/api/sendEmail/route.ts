// app/api/sendEmail/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Estendi il timeout per le API route di Next.js
export const maxDuration = 60;

export async function POST(request: Request) {
  let transporter;

  try {
    console.log("Inizio elaborazione richiesta email");

    // Parsing dei dati
    let data;
    try {
      data = await request.json();
      console.log("Dati ricevuti:", {
        nome: data.nome,
        cognome: data.cognome,
        email: data.email,
      });
    } catch (parseError) {
      console.error("Errore nel parsing dei dati:", parseError);
      return NextResponse.json(
        { error: "Formato dati non valido" },
        { status: 400 }
      );
    }

    // Validazione basilare
    if (!data.nome || !data.cognome || !data.email) {
      console.error("Validazione fallita: dati mancanti");
      return NextResponse.json(
        { error: "Dati obbligatori mancanti" },
        { status: 400 }
      );
    }

    // Creazione transporter con configurazione ottimizzata
    console.log("Creazione transporter con:", {
      host: "smtps.aruba.it",
      port: 465,
      user: process.env.EMAIL_USER ? "impostato" : "mancante",
    });

    transporter = nodemailer.createTransport({
      host: "smtps.aruba.it",
      port: 465,
      secure: true,
      connectionTimeout: 10000, // 10 secondi per la connessione
      greetingTimeout: 5000, // 5 secondi per il saluto
      socketTimeout: 15000, // 15 secondi per operazioni socket
      debug: true, // abilita il debug
      logger: true, // log dettagliati
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // accetta certificati autofirmati
      },
    });

    // Test di connessione SMTP
    console.log("Verifica connessione SMTP...");
    try {
      await transporter.verify();
      console.log("✅ Connessione SMTP verificata con successo");
    } catch (verifyError) {
      console.error("❌ Errore verifica SMTP:", verifyError);
      // Continuiamo comunque con il tentativo di invio
    }

    // Preparazione contenuto email
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
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `Richiesta certificato - ${data.nome} ${data.cognome}`,
      text: emailContent,
      // Imposta priorità alta
      priority: "high",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
      },
    };

    console.log("Tentativo invio email...");

    // Tentativo di invio con gestione errori migliorata
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email inviata con successo:", {
        messageId: info.messageId,
        response: info.response,
      });

      return NextResponse.json({
        success: true,
        messageId: info.messageId,
      });
    } catch (sendError) {
      console.error("❌ Errore specifico nell'invio dell'email:", sendError);

      if (sendError.code === "ETIMEDOUT") {
        return NextResponse.json(
          { error: "Timeout di connessione al server email" },
          { status: 408 }
        );
      }

      if (sendError.code === "EAUTH") {
        return NextResponse.json(
          { error: "Errore di autenticazione email" },
          { status: 401 }
        );
      }

      if (sendError.code === "ESOCKET") {
        return NextResponse.json(
          { error: "Errore di connessione al server email" },
          { status: 503 }
        );
      }

      throw sendError;
    }
  } catch (error) {
    console.error("❌ Errore generale nell'elaborazione:", error);

    // Tenta di estrarre informazioni dettagliate
    const errorDetails = {
      message: error.message || "Errore sconosciuto",
      code: error.code || "UNKNOWN",
      command: error.command || null,
      responseCode: error.responseCode || null,
    };

    console.error("Dettagli errore:", errorDetails);

    return NextResponse.json(
      {
        error: "Errore durante l'invio dell'email",
        details: errorDetails,
      },
      { status: 500 }
    );
  } finally {
    if (transporter) {
      try {
        await transporter.close();
        console.log("Connessione transporter chiusa");
      } catch (closeError) {
        console.error("Errore nella chiusura della connessione:", closeError);
      }
    }
  }
}
