import Telnyx from "telnyx";

export default async function handler(req, res) {
  const {
    name,
    instructions,
    greeting,
    model,
    enabled_features,
    transcription,
  } = req.body;

  const client = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });
  try {
    const createAssistant = await client.ai.assistants.create({
      name,
      instructions,
      greeting,
      model,
      enabled_features,
      voice_settings: {
        voice: "Telnyx.NaturalHD.orion",
      },
      transcription: {
        // model: transcription.model,
        model: "distil-whisper/distil-large-v2",
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
            custom_headers: [],
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

    const texmlApplication = await client.texmlApplications.create({
      friendly_name: "ai_app-" + createAssistant.id,
      voice_url: "https://example.com/api/telnyx/voice-webhoo",
    });
    const inferenceEmbedding = await client.ai.assistants.update(
      createAssistant.id,
      {
        telephony_settings: {
          default_texml_app_id: texmlApplication.id,
        },
      }
    );

    return res.status(200).json(inferenceEmbedding);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
