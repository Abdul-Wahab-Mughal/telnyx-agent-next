import Telnyx from 'telnyx';

export default async function handler(req, res) {
  const client = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });
  try {
    const assistantsList = await client.ai.assistants.list();
    res.status(200).json(assistantsList.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
