import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const createTransporter = async () => {
  const cleanEmail = process.env.EMAIL_USER_CONTATTI?.replace(/[",\s]/g, "");

  const config = {
    host: "smtps.aruba.it",
    port: 465,
    secure: true,
    auth: {
      user: cleanEmail,
      pass: process.env.EMAIL_PASSWORD_CONTATTI,
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
    const { type } = data;

    transporter = await createTransporter();

    if (type === "contact") {
      const { nome, cognome, tel, mail } = data;

      const contactEmailContent = `
        Nuova richiesta di contatto:

        Dati Personali:
        Nome: ${nome}
        Cognome: ${cognome}
        Telefono: ${tel}
        Email: ${mail}

        Data richiesta: ${new Date().toLocaleString("it-IT")}
      `;

      const contactMailOptions = {
        from: process.env.EMAIL_TO_CONTATTI,
        to: process.env.EMAIL_TO_CONTATTI,
        subject: `Nuova richiesta di contatto - ${nome} ${cognome}`,
        text: contactEmailContent,
        headers: {
          "X-Request-Type": "contact-form",
          "X-Contact-Name": `${nome} ${cognome}`,
          "X-Contact-Email": mail,
        },
      };

      await transporter.sendMail(contactMailOptions);

      const userConfirmationEmail = {
        from: process.env.EMAIL_TO_CONTATTI,
        to: mail,
        subject: "Abbiamo ricevuto la tua richiesta - SNALV Confsal",
        text: `
          Gentile ${nome} ${cognome},

          Abbiamo ricevuto la tua richiesta di contatto.
          Un nostro operatore ti contatterà il prima possibile al numero ${tel}.

          Cordiali saluti,
          SNALV Confsal
        `,
      };

      await transporter.sendMail(userConfirmationEmail);
    } else if (type === "newsletter") {
      const { email } = data;

      const newsletterEmailContent = `
        Nuova iscrizione alla newsletter:

        Email: ${email}
        Data iscrizione: ${new Date().toLocaleString("it-IT")}
      `;

      const newsletterMailOptions = {
        from: process.env.EMAIL_TO_CONTATTI,
        to: process.env.EMAIL_TO_CONTATTI,
        subject: "Nuova iscrizione alla newsletter",
        text: newsletterEmailContent,
        headers: {
          "X-Request-Type": "newsletter-subscription",
          "X-Subscriber-Email": email,
        },
      };

      await transporter.sendMail(newsletterMailOptions);

      const welcomeEmail = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Benvenuto nella Newsletter SNALV Confsal",
        text: `
          Grazie per esserti iscritto alla nostra newsletter!

          Riceverai mensilmente notizie e aggiornamenti dal mondo del lavoro.
          
          Cordiali saluti,
          SNALV Confsal
        `,
      };

      await transporter.sendMail(welcomeEmail);
    }

    return NextResponse.json({ success: true });
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
