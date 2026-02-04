import Telnyx from "telnyx";

export default async function handler(req, res) {
  const { assistantId, numberId } = req.body;

  const client = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });
  try {
    await client.phoneNumbers.update(numberId, {
      connection_id: assistantId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
