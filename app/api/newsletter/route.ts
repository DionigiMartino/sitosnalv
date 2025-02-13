// app/api/newsletter/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    console.log("API Key present:", !!apiKey); // Log per debug

    if (!apiKey) {
      console.error("BREVO_API_KEY is not defined in environment variables");
      return NextResponse.json(
        { error: "API key configuration missing" },
        { status: 500 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("Attempting Brevo API call with email:", email);

    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey, // Assicurati che inizi con 'xkeysib-'
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
      }),
    });

    const responseText = await brevoResponse.text();
    console.log("Brevo API response:", responseText);

    if (!brevoResponse.ok) {
      console.error("Brevo API error:", responseText);
      return NextResponse.json(
        { error: "Failed to subscribe: " + responseText },
        { status: brevoResponse.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
