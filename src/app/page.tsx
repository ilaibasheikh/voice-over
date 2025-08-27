import TextToSpeech from "./components/TextToSpeech";

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto ">
        <h1 className="text-3xl  font-bold  text-center mb-8">AI Voice Generator
        </h1>
        <TextToSpeech />
      </div>
    </main>
  );
}