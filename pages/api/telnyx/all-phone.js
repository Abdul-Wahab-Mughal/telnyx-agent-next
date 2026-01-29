import Telnyx from "telnyx";

export default async function handler(req, res) {
  const client = new Telnyx({
    apiKey: process.env.TELNYX_API_KEY,
  });

  // Automatically fetches more pages as needed.
  try {
    const availablePhoneNumberBlocks = await client.availablePhoneNumberBlocks.list();

    res.status(200).json(availablePhoneNumberBlocks.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
