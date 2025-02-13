// pages/api/newsletter.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error adding contact to Brevo");
    }

    return res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return res.status(500).json({ message: "Error processing subscription" });
  }
}
