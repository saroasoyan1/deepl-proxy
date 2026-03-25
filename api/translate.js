export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const text = body.text;
    const targetLang = body.targetLang;

    if (!text || !targetLang) {
      return res.status(400).json({ error: "Missing text or targetLang" });
    }

    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": "DeepL-Auth-Key 7f4fa647-93da-4aea-8c4f-f2c4b0cbc46b",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang
      })
    });

    const data = await response.json();
    
    if (!data.translations || !data.translations[0]) {
      return res.status(500).json({ error: "DeepL returned no translations", raw: data });
    }

    return res.status(200).json({ translatedText: data.translations[0].text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
