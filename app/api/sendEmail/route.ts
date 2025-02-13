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
      type: "LOGIN",
    },
    authMethod: "LOGIN",
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1",
    },
    debug: true,
    logger: true,
  };

  const transporter = nodemailer.createTransport(config);

  try {
    await transporter.verify();
    console.log("Connessione al server SMTP verificata con successo");
    return transporter;
  } catch (error) {
    console.error("Errore nella verifica della connessione SMTP:", error);

    if (error.code === "EAUTH") {
      console.log("Dettagli autenticazione:", {
        user: cleanEmail,
        authMethod: config.authMethod,
        errorResponse: error.response,
      });
    }
    throw error;
  }
};

export async function POST(request: Request) {
  let transporter;

  try {
    transporter = await createTransporter();
    const data = await request.json();

    if (!data.nome || !data.cognome || !data.email) {
      return NextResponse.json(
        { error: "Dati obbligatori mancanti" },
        { status: 400 }
      );
    }

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

    const cleanEmail = process.env.EMAIL_USER?.replace(/[",\s]/g, "");

    const mailOptions = {
      from: cleanEmail,
      to: process.env.EMAIL_TO?.replace(/[",\s]/g, ""),
      subject: "Richiesta di certificato assicurativo",
      text: emailContent,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email inviata con successo:", info.messageId);
      return NextResponse.json({
        success: true,
        messageId: info.messageId,
      });
    } catch (sendError) {
      console.error("Errore specifico nell'invio dell'email:", sendError);
      throw sendError;
    }
  } catch (error) {
    console.error("Errore generale nell'elaborazione della richiesta:", error);
    let errorMessage = "Errore durante l'invio dell'email";
    let statusCode = 500;

    if (error instanceof Error) {
      console.log("Dettagli errore:", error.message);
      if (error.message.includes("EAUTH")) {
        errorMessage =
          "Errore di autenticazione. Verifica che le credenziali siano corrette e che l'account sia configurato per l'accesso SMTP.";
        console.log("Risposta completa del server:", error);
      }
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
