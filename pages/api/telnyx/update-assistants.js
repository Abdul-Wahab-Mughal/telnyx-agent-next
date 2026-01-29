import Telnyx from "telnyx";

export default async function handler(req, res) {
  const { id, name, model } = req.body;

  const client = new Telnyx({
    apiKey: process.env.TELNYX_API_KEY,
  });
  try {
    const inferenceEmbedding = await client.ai.assistants.update(id, {
      name,
      model,
    });
    res.status(200).json(inferenceEmbedding);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
