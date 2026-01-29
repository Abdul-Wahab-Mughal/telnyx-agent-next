import Telnyx from "telnyx";

const client = new Telnyx({
  apiKey: process.env.TELNYX_API_KEY,
});

export default async function handler(req, res) {
  const event = req.body.data;

  // When call is answered
  if (event.event_type === "call.answered") {
    const callControlId = event.payload.call_control_id;

    // Agent speaks
    await client.calls.speak(callControlId, {
      payload: "Hello, this is Talkloop AI agent. How can I help you today?",
      voice: "female",
      language: "en-US",
    });
  }

  res.status(200).json({ received: true });
}
