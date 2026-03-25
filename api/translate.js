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
    const { text, targetLang } = req.body;

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
    const translated = data.translations[0].text;
    return res.status(200).json({ translatedText: translated });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
