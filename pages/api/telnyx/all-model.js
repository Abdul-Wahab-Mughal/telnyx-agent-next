import Telnyx from "telnyx";

export default async function handler(req, res) {
  const client = new Telnyx({
    apiKey: process.env.TELNYX_API_KEY,
  });

  try {
    const response = await client.ai.retrieveModels();
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  // console.log(response.data);
}
