import Telnyx from "telnyx";

export default async function handler(req, res) {
  const { assistantId, voice, text } = req.body;

  if (!assistantId || !voice || !text)
    return res.status(400).json({ error: "Missing params" });

  const client = new Telnyx({ apiKey: process.env.TELNYX_API_KEY });

  try {
    const { voice, text } = req.body;
    if (!voice || !text) {
      return res.status(400).json({ error: "voice and text are required" });
    }
    const audioData = await client.textToSpeech.generateSpeech({
        voice,
        text,
      });

    // The Telnyx SDK returns a Response object with audio data
    // We need to pipe the audio back to the client

    if (audioData?.body) {
      res.setHeader("Content-Type", "audio/mpeg");
      // If it's a ReadableStream / node stream
      if (typeof audioData.body.pipe === "function") {
        audioData.body.pipe(res);
      } else if (audioData.body instanceof ReadableStream) {
        const reader = audioData.body.getReader();
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };
        await pump();
      } else {
        // Try arrayBuffer fallback
        const buffer = await audioData.arrayBuffer();
        res.setHeader("Content-Type", "audio/mpeg");
        res.send(Buffer.from(buffer));
      }
    } else if (Buffer.isBuffer(audioData)) {
      res.setHeader("Content-Type", "audio/mpeg");
      res.send(audioData);
    } else {
      // Last resort: try to get the raw data
      const buffer = await (audioResponse).arrayBuffer?.();
      if (buffer) {
        res.setHeader("Content-Type", "audio/mpeg");
        res.send(Buffer.from(buffer));
      } else {
        res.status(500).json({ error: "Unexpected audio response format" });
      }
    }
  } catch (error) {
    console.error("Error generating voice preview:", error);
    res.status(500).json({
      error: error.message || "Failed to generate voice preview",
    });
  }
}
