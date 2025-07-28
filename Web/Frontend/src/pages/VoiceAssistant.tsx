
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, Loader } from 'lucide-react';

const VoiceAssistant: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasAutoPlayed = useRef<boolean>(false);

  const API_BASE_URL = 'https://web-production-5227.up.railway.app';

  // Auto-play audio when audioUrl changes
  useEffect(() => {
    if (audioUrl && audioRef.current && !hasAutoPlayed.current) {
      audioRef.current.play().catch(error => {
        console.error('Error auto-playing audio:', error);
      });
      hasAutoPlayed.current = true;
    }
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');

      const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setTextInput(data.text);
      
      // Automatically process the transcribed text
      await processCommand(data.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Error transcribing audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const processCommand = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    // Reset auto-play flag for new response
    hasAutoPlayed.current = false;
    
    try {
      const response = await fetch(`${API_BASE_URL}/process_command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Command processing failed');
      }

      const data = await response.json();
      setResponse(data.response);
      
      if (data.audio_url) {
        setAudioUrl(`${API_BASE_URL}${data.audio_url}`);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      setResponse('Sorry, I could not process your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(textInput);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Smart Factory Voice Assistant
          </h1>
          
          {/* Audio Input Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Voice Input</h2>
            <div className="flex justify-center">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full text-white font-medium transition-colors ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRecording ? (
                  <>
                    <MicOff size={20} />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic size={20} />
                    <span>Start Recording</span>
                  </>
                )}
              </button>
            </div>
            {isRecording && (
              <p className="text-center text-red-500 mt-2 font-medium">
                Recording... Click stop when done
              </p>
            )}
          </div>

          {/* Text Input Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Text Input</h2>
            <form onSubmit={handleTextSubmit} className="flex space-x-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your question about the factory..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !textInput.trim()}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send size={20} />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center mb-6">
              <Loader className="animate-spin text-blue-500" size={24} />
              <span className="ml-2 text-gray-600">Processing...</span>
            </div>
          )}

          {/* Response Section */}
          {response && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Assistant Response</h2>
                {audioUrl && (
                  <button
                    onClick={playAudio}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    <Volume2 size={20} />
                    <span>Replay Audio</span>
                  </button>
                )}
              </div>
              <p className="text-gray-800 text-lg leading-relaxed">{response}</p>
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  className="hidden"
                />
              )}
            </div>
          )}

          {/* Usage Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">How to use:</h3>
            <ul className="text-blue-700 space-y-1">
              <li>• Use voice input by clicking "Start Recording" and speak your question</li>
              <li>• Or type your question in the text input field</li>
              <li>• Ask about machine status, temperature, maintenance, production data, etc.</li>
              <li>• Examples: "What is the temperature of the Furnace?", "Which machines need maintenance?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
