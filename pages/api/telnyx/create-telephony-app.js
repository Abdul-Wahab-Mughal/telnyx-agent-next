import Telnyx from "telnyx";

export default async function handler(req, res) {
  const { friendly_name } = req.body;

  const client = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });
  // Automatically fetches more pages as needed.
  try {
    // const numberOrderListResponse = await client.numberOrders.list();
    const texmlApplication = await client.texmlApplications.create({
      friendly_name: friendly_name,
      voice_url: "https://example.com/api/telnyx/voice-webhoo",
    });

    res.status(200).json(texmlApplication.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
