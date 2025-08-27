"use client";

import React, { useState, useRef, useEffect } from "react";

const TextToSpeech = () => {
    const [text, setText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState("zT03pEAEi0VHKciJODfn");
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [words, setWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
    const wordIntervalRef = useRef<NodeJS.Timeout | null>(null);


    const voices = [

        { id: "zT03pEAEi0VHKciJODfn", name: "Raju" },
        { id: "kLuXkg0zRFuSas1JFmMT", name: "Sohaib" },
        { id: "SZfY4K69FwXus87eayHK", name: "Nikita" },
        { id: "ynkbQM1aYB3vamJqvwzD", name: "Ridan" },
        { id: "UZZqzIlYlY2k9e2jbpM0", name: "Raqib" },
        { id: "aPfeouerZvEVukwmLSP0", name: "Masti" },
    ];

    useEffect(() => {
        setWords(text.trim().split(/\s+/));
    }, [text]);

    // const handleGenerateAudio = async () => {
    //     if (!text.trim()) return;

    //     setIsGenerating(true);
    //     setError(null);

    //     try {
    //         const response = await fetch("/api/text-to-speech", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",

    //             },
    //             body: JSON.stringify({
    //                 text,
    //                 voice: selectedVoice,
    //             }),
    //         });

    //         const data = await response.json();
    //         if (!response.ok) {
    //             throw new Error(data.error || "Failed to generate audio");

    //         }
    //         const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
    //         setAudioElement(audio);

    //         audio.onended = () => setIsPlaying(false);
    //         audio.play();
    //         setIsPlaying(true);
    //     }
    //     catch (error: any) {
    //         console.error("Error generating audio: ", error);
    //         setError(error.message || "Failed to generate audio. Please Try again.");

    //     } finally {
    //         setIsGenerating(false);
    //     }
    // };
    const handleGenerateAudio = async () => {
        if (!text.trim()) return;

        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    voice: selectedVoice,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to generate audio");
            }

            const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
            setAudioElement(audio);

            // 🔹 Highlight Words (approximate timing)
            const wordList = text.trim().split(/\s+/);
            setWords(wordList);
            setCurrentWordIndex(-1); // reset

            audio.onloadedmetadata = () => {
                const duration = audio.duration; // seconds
                const highlightSpeedMultiplier = 1.3;
                const wordDuration = (duration / wordList.length) * highlightSpeedMultiplier;

                let index = 0;
                wordIntervalRef.current = setInterval(() => {
                    setCurrentWordIndex(index);
                    index++;
                    if (index >= wordList.length) {
                        clearInterval(wordIntervalRef.current!);
                    }
                }, wordDuration * 1100);
            };

            audio.onended = () => {
                setIsPlaying(false);
                clearInterval(wordIntervalRef.current!);
                setCurrentWordIndex(-1); // clear highlight
            };
            audio.playbackRate = 1.0; // 1.0 = normal, 1.2 = faster, 0.8 = slower

            audio.play();
            setIsPlaying(true);
        } catch (error: any) {
            console.error("Error generating audio: ", error);
            setError(error.message || "Failed to generate audio. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePlayPause = () => {
        if (!audioElement) return;

        if (isPlaying) {
            audioElement.pause();

        } else {

            audioElement.play();
        }

        setIsPlaying(!isPlaying);
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-md" >
            <div className="space-y-4" >
                {/* Voice */}
                <div>
                    <label className="block  text-sm font-medium mb-2 "> Select voice </label>
                    <select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        {voices.map((voice) => (
                            <option key={voice.id} value={voice.id}>
                                {voice.name}
                            </option>
                        ))}

                    </select>
                </div>
                {/* Text */}
                {/* <div>
                    <label className="block text-sm  font-medium mb-2 "> Enter Text</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text you want to convert to speech..."
                        className="w-full h-32 p-2 border rounded-md resize-none"
                    />
                    

                </div> */}
                {/* Text with highlight overlay */}
                <div>
                    <label className="block text-sm font-medium mb-2">Enter Text</label>
                    <div className="relative w-full h-32">
                        {/* Highlight Layer */}
                        <div
                            className="absolute inset-0 p-2 whitespace-pre-wrap break-words pointer-events-none text-transparent"
                            aria-hidden="true"
                        >
                            {words.map((word, index) => (
                                <span
                                    key={index}
                                    className={
                                        index === currentWordIndex
                                            ? "bg-yellow-300 "
                                            : "text-white"
                                    }
                                >
                                    {word + " "}
                                </span>
                            ))}
                        </div>

                        {/* Transparent Textarea */}
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="absolute inset-0 w-full h-full p-2 border rounded-md resize-none bg-transparent text-gray-900"
                            style={{ caretColor: "black" }}
                            placeholder="Enter text you want to convert to speech..."
                        />
                    </div>
                </div>
                {/* Error */}
                {error && (
                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}
                {/* Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={handleGenerateAudio}
                        disabled={isGenerating || !text.trim()}
                        className={`flex-1 px-4  py-2 rounded-md  text-white  
                        ${isGenerating || !text.trim()
                                ? "bg-gray-400"
                                : "bg-blue-900 hover:bg-blue-800"
                            }`
                        }
                    >
                        {isGenerating ? "isGenerating" : "Generate Audio"}
                    </button>

                    {audioElement && (
                        <button
                            onClick={handlePlayPause}
                            className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        >
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextToSpeech;
