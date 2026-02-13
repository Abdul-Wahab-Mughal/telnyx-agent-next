import Telnyx from "telnyx";

export default async function handler(req, res) {
  const client = new Telnyx({
    apiKey: process.env.TELNYX_API_KEY,
  });

  // Automatically fetches more pages as needed.
  try {
    const availablePhoneNumbers = await client.availablePhoneNumbers.list({
      filter: {
        country_code: "US",
        administrative_area: "MN",
        phone_number_type: "local",
      },
    });

    res.status(200).json(availablePhoneNumbers.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
