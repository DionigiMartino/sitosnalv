// app/api/newsletter/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Debug delle variabili d'ambiente
  console.log("Environment variables:", {
    nodeEnv: process.env.NODE_ENV,
    hasBrevoKey: !!process.env.BREVO_API_KEY,
    allEnvKeys: Object.keys(process.env),
  });

  const apiKey = process.env.BREVO_API_KEY;

  // Se la chiave non è presente, logghiamo più informazioni
  if (!apiKey) {
    console.error(
      "API Key missing. Available environment variables:",
      Object.keys(process.env).filter((key) => !key.includes("SECRET"))
    );
    return NextResponse.json(
      { error: "API key configuration missing" },
      { status: 500 }
    );
  }

  try {
    const { email } = await request.json();

    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
      }),
    });

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text();
      console.error("Brevo API error response:", errorText);
      return NextResponse.json(
        { error: `Subscription failed: ${errorText}` },
        { status: brevoResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription successful",
    });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
