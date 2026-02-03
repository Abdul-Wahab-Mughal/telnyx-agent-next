import Telnyx from "telnyx";

export default async function handler(req, res) {
  const client = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });
  try {
    // const createAssistant = await client.numberOrders.list();
    // return res.status(200).json(createAssistant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
