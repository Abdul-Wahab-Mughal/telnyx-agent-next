import Telnyx from "telnyx";

export default async function handler(req, res) {
  const { name, instructions, greeting, model, enabled_features } = req.body;

  const client = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });
  try {
    const createAssistant = await client.ai.assistants.create({
      name,
      instructions,
      greeting,
      model,
      enabled_features,
      voice_settings: {
        voice: "Telnyx.KokoroTTS.af_heart",
      },
    });
    return res.status(200).json(createAssistant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
