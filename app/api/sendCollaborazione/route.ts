import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const createTransporter = async () => {
  const cleanEmail = process.env.EMAIL_USER_ORGANIZZAZIONE?.replace(
    /[",\s]/g,
    ""
  );

  const config = {
    host: "smtps.aruba.it",
    port: 465,
    secure: true,
    auth: {
      user: cleanEmail,
      pass: process.env.EMAIL_PASSWORD_ORGANIZZAZIONE,
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
    const data = await request.json();
    const { nome, cognome, professione, domicilio, cellulare, email } = data;

    transporter = await createTransporter();

    // Email per lo staff
    const staffEmailContent = `
      Nuova richiesta di collaborazione:

      Dati Personali:
      Nome: ${nome}
      Cognome: ${cognome}
      Professione attuale: ${professione}
      Domicilio: ${domicilio}

      Contatti:
      Cellulare: ${cellulare}
      Email: ${email}

      Data richiesta: ${new Date().toLocaleString("it-IT")}
    `;

    const staffMailOptions = {
      from: process.env.EMAIL_TO_ORGANIZZAZIONE,
      to: process.env.EMAIL_TO_ORGANIZZAZIONE,
      subject: `Nuova richiesta di collaborazione - ${nome} ${cognome}`,
      text: staffEmailContent,
      headers: {
        "X-Request-Type": "collaboration",
        "X-Applicant-Name": `${nome} ${cognome}`,
        "X-Applicant-Location": domicilio,
      },
    };

    await transporter.sendMail(staffMailOptions);

    // Email di conferma al candidato
    const candidateEmailContent = `
      Gentile ${nome} ${cognome},

      Grazie per il tuo interesse a collaborare con SNALV Confsal.

      Abbiamo ricevuto la tua richiesta di collaborazione e la valuteremo con attenzione.
      Ti contatteremo presto al numero ${cellulare} per discutere delle opportunità disponibili nella tua zona (${domicilio}).

      Ecco un riepilogo dei dati che ci hai fornito:
      - Professione attuale: ${professione}
      - Domicilio: ${domicilio}
      - Contatti: ${cellulare}, ${email}

      Se nel frattempo hai domande, non esitare a contattarci.

      Cordiali saluti,
      SNALV Confsal
    `;

    const candidateMailOptions = {
      from: process.env.EMAIL_TO_ORGANIZZAZIONE,
      to: email,
      subject:
        "Abbiamo ricevuto la tua richiesta di collaborazione - SNALV Confsal",
      text: candidateEmailContent,
    };

    await transporter.sendMail(candidateMailOptions);

    return NextResponse.json({
      success: true,
      message: "Richiesta inviata con successo",
    });
  } catch (error) {
    console.error("Errore nell'elaborazione della richiesta:", error);
    return NextResponse.json(
      { error: "Errore durante l'invio della richiesta" },
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
