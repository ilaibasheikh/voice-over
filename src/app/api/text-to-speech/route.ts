import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            console.error("ELEVENLABS_API_KEY is not configured")
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        const { text, voice } = await request.json();

        if (!text || !voice) {
            return NextResponse.json(
                { error: "Missing required fields: 'text' and 'voice'" },
                { status: 400 }
            );
        }
       

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
            {
                method: "POST",
                headers: {
                    Accept: "audio/mpeg",
                    "Content-Type": "application/json",
                    "xi-api-key": apiKey,
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.7,
                        similarity_boost: 1.0,
                    },
                }),
            }
        );
        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Response:", errorData);
            const errorMessage = errorData.detail?.message || "Failed to generate speech";
            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }
        const audioBuffer = await response.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString("base64");
        return NextResponse.json({ audio: audioBase64 });
    } catch (error: any) {
        console.error("Text-to-speech generation error: ", error);
        const errorMessage =
            typeof error === "object" && error != null
                ? JSON.stringify(error)
                : error.message || "Failed to generate speech";

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );

    }

}
