import Telnyx from "telnyx";

export default async function handler(req, res) {
  const { id, name, instructions, model, greeting, transcription } = req.body;

  const client = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });
  try {
    const inferenceEmbedding = await client.ai.assistants.update(id, {
      name,
      model,
      instructions,
      greeting,
      voice_settings: {
        voice: "Telnyx.NaturalHD.orion",
      },
      transcription: {
        model: transcription.model,
        language: "auto",
      },
      tools: [
        {
          type: "transfer",
          transfer: {
            from: "+16896000257",
            targets: [
              {
                name: "cody",
                to: "+923245807128",
              },
            ],
            warm_transfer_instructions:
              "when customer says transfer my call or they want to talk to agent then transfer there call to agent cody",
          },
        },
        {
          type: "hangup",
          hangup: {
            description:
              "To be used whenever the conversation has ended and it would be appropriate to hangup the call.",
          },
        },
      ],
    });
    return res.status(200).json(inferenceEmbedding);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
