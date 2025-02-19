// app/api/send-contatto/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    // Inizializza Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Ottieni i dati dalla richiesta
    const data = await request.json();
    const { type } = data;

    if (type === "contact") {
      // Gestione form di contatto
      const { nome, cognome, tel, mail } = data;

      // Valida i dati essenziali
      if (!nome || !cognome || !tel || !mail) {
        return NextResponse.json(
          { error: "Dati obbligatori mancanti" },
          { status: 400 }
        );
      }

      // Contenuto email per lo staff
      const contactEmailContent = `
        Nuova richiesta di contatto:

        Dati Personali:
        Nome: ${nome}
        Cognome: ${cognome}
        Telefono: ${tel}
        Email: ${mail}

        Data richiesta: ${new Date().toLocaleString("it-IT")}
      `;

      // Invia email allo staff
      const staffResult = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: ["sitosnalv@gmail.com"],
        subject: `Nuova richiesta di contatto - ${nome} ${cognome}`,
        text: contactEmailContent,
        headers: {
          "X-Request-Type": "contact-form",
          "X-Contact-Name": `${nome} ${cognome}`,
          "X-Contact-Email": mail,
        },
      });

      console.log("Email di notifica inviata:", staffResult);

      // Email di conferma all'utente
      const userConfirmationContent = `
        Gentile ${nome} ${cognome},

        Abbiamo ricevuto la tua richiesta di contatto.
        Un nostro operatore ti contatterà il prima possibile al numero ${tel}.

        Cordiali saluti,
        SNALV Confsal
      `;

      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: [mail],
          subject: "Abbiamo ricevuto la tua richiesta - SNALV Confsal",
          text: userConfirmationContent,
        });
      } catch (confirmError) {
        console.warn(
          "Non è stato possibile inviare l'email di conferma:",
          confirmError
        );
        // Continuiamo comunque, l'email allo staff è stata inviata
      }
    } else if (type === "newsletter") {
      // Gestione iscrizione newsletter
      const { email } = data;

      if (!email) {
        return NextResponse.json(
          { error: "Email obbligatoria mancante" },
          { status: 400 }
        );
      }

      // Contenuto email notifica iscrizione
      const newsletterEmailContent = `
        Nuova iscrizione alla newsletter:

        Email: ${email}
        Data iscrizione: ${new Date().toLocaleString("it-IT")}
      `;

      // Invia notifica allo staff
      const newsletterResult = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: ["sitosnalv@gmail.com"],
        subject: "Nuova iscrizione alla newsletter",
        text: newsletterEmailContent,
        headers: {
          "X-Request-Type": "newsletter-subscription",
          "X-Subscriber-Email": email,
        },
      });

      console.log("Notifica newsletter inviata:", newsletterResult);

      // Email di benvenuto all'iscritto
      const welcomeContent = `
        Grazie per esserti iscritto alla nostra newsletter!

        Riceverai mensilmente notizie e aggiornamenti dal mondo del lavoro.
        
        Cordiali saluti,
        SNALV Confsal
      `;

      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: [email],
          subject: "Benvenuto nella Newsletter SNALV Confsal",
          text: welcomeContent,
        });
      } catch (welcomeError) {
        console.warn(
          "Non è stato possibile inviare l'email di benvenuto:",
          welcomeError
        );
        // Continuiamo comunque, la notifica allo staff è stata inviata
      }
    } else {
      return NextResponse.json(
        { error: "Tipo di richiesta non valido" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
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
