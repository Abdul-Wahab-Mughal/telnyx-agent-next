import Telnyx from "telnyx";

export default async function handler(req, res) {
  const client = new Telnyx({
    apiKey: process.env.TELNYX_API_KEY,
  });

  // Automatically fetches more pages as needed.
  try {
    // const apps = await client.telephony.apps.list();
    const texmlApplication = await client.texmlApplications.list();

    res.status(200).json(texmlApplication.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}