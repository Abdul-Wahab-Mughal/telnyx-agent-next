import Telnyx from "telnyx";

export default async function handler(req, res) {
  const client = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });
  const { id } = req.body;

  try {
    const deleteApp = await client.texmlApplications.delete(id);
    return res.status(200).json(deleteApp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
