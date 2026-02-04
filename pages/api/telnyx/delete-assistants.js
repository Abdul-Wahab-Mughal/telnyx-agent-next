import Telnyx from "telnyx";

export default async function handler(req, res) {
  const client = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });
  const { id, app_id } = req.body;

  try {
    // Assistant
    const deleteAssistant = await client.ai.assistants.delete(id);
    // app
    // const deleteApp = await client.texmlApplications.delete(app_id);
    return res.status(200).json(deleteAssistant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
