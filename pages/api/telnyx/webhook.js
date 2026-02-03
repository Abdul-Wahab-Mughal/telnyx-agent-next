import Telnyx from "telnyx";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const client = new Telnyx({
      apiKey: process.env.TELNYX_API_KEY,
    });
    const event = req.body;

    console.log("--- Telnyx Webhook Received ---");
    console.log("Event Type:", event.data?.event_type);
    console.log("Body:", JSON.stringify(event, null, 2));
    console.log("-------------------------------");

    if (event.data?.event_type === "call.initiated") {
      const callControlId = event.data.payload.call_control_id;
      console.log(
        `Handling call.initiated for call_control_id: ${callControlId}`,
      );

      try {
        console.log(`Answered call: ${callControlId}`);
        // Answer the call
        await client.calls.actions.answer(callControlId);
        console.log(`Answered call: ${callControlId}`);

        // Start AI assistant
        // Using found assistant ID: SJ Sales Agent
        const assistantId = "assistant-03019a16-c2e8-478c-9d23-16add001b0f6";
        const res = await client.post(
          `/calls/${callControlId}/actions/ai_assistant_start`,
          {
            body: { assistant: { id: assistantId } },
          },
        );

        console.log(
          `Started AI assistant ${assistantId} for call: ${callControlId}`,
          res,
        );
      } catch (error) {
        console.error("Error handling call:", error.message);
      }
    }

    res.status(200).json({ status: "success" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
