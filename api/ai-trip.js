import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { style, budget, days, from } = req.body;

  const prompt = `
Suggest 3 travel destinations.
Travel style: ${style}
Budget: ${budget}
Trip duration: ${days} days
Departure city: ${from}

Return results in this format:
1. Destination – short reason
2. Destination – short reason
3. Destination – short reason
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    res.status(200).json({
      result: response.choices[0].message.content
    });
  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
}

