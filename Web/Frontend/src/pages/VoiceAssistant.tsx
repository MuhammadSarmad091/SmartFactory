import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, Loader, MessageCircle, Headphones } from 'lucide-react'; // Removed LogIn, LogOut icons

const VoiceAssistant: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  // Token state still reads from localStorage
  const [token, setToken] = useState<string | null>(localStorage.getItem('factory_token')); 

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasAutoPlayed = useRef<boolean>(false);

  // IMPORTANT: Replace with your deployed Flask app's URL
  const FLASK_API_BASE_URL = 'https://smartfactoryvoiceassistant-production.up.railway.app';
  // MERN_AUTH_API_URL is no longer needed here as login UI is removed.
  // The Flask app will use its configured MERN API URL for actions.

  // Auto-play audio when audioUrl changes
  useEffect(() => {
    if (audioUrl && audioRef.current && !hasAutoPlayed.current) {
      audioRef.current.play().catch(error => {
        console.error('Error auto-playing audio:', error);
      });
      hasAutoPlayed.current = true;
    }
  }, [audioUrl]);

  // Effect to save/remove token from local storage
  // This remains to keep the token synchronized with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('factory_token', token);
    } else {
      localStorage.removeItem('factory_token');
    }
  }, [token]);

  // --- Voice Input Logic ---
  const startRecording = async () => {
    try {
      setResponse(''); // Clear previous response
      setAudioUrl(null); // Clear previous audio
      hasAutoPlayed.current = false; // Reset autoplay flag

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

      const res = await fetch(`${FLASK_API_BASE_URL}/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Transcription failed');
      }

      const data = await res.json();
      setTextInput(data.text);
      
      // Automatically process the transcribed text
      await processCommand(data.text);
    } catch (error: any) {
      console.error('Error transcribing audio:', error);
      setResponse(`Error transcribing audio: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Command Processing Logic (sends token to Flask) ---
  const processCommand = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setResponse(''); // Clear previous response
    setAudioUrl(null); // Clear previous audio
    hasAutoPlayed.current = false; // Reset autoplay flag
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      // Always send Authorization header if a token exists in localStorage
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // If no token is found, inform the user that actions requiring auth might fail
        setResponse('No authentication token found. Some actions may require you to be logged into the main dashboard.');
      }

      const res = await fetch(`${FLASK_API_BASE_URL}/process_command`, {
        method: 'POST',
        headers: headers, // Use the dynamically built headers
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Handle 401/403 specifically to inform about authentication for actions
        if (res.status === 401 || res.status === 403) {
          setResponse('This action requires authentication. Please ensure you are logged into the main dashboard.');
          // Do NOT clear the token here, as it might be valid for other parts of the app
          // and the user is expected to log in via the dashboard.
          return; // Stop further processing
        }
        throw new Error(errorData.error || 'Command processing failed');
      }

      const data = await res.json();
      setResponse(data.response);
      
      if (data.audio_url) {
        setAudioUrl(`${FLASK_API_BASE_URL}${data.audio_url}`);
      }
    } catch (error: any) {
      console.error('Error processing command:', error);
      setResponse(`Sorry, I could not process your request: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(textInput);
  };

  // handleKeyDown function for Enter/Shift+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(e);
    }
    // Shift+Enter will naturally create a new line, no explicit action needed.
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full shadow-lg">
              <MessageCircle className="text-white" size={32} />
            </div>
          </div>
            <h1
    className="
      text-3xl sm:text-4xl lg:text-5xl 
      leading-relaxed 
      pb-2           /* try 4 or even pb-6 */
      font-bold 
      bg-gradient-to-r from-blue-600 to-purple-600 
      bg-clip-text text-transparent 
      mb-2 
      overflow-visible
    "
  >
    Smart Factory Voice Assistant
  </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Ask questions about your factory operations using voice or text
          </p>
        </div>

        {/* Removed Login Section */}
        {/* The login functionality is now handled by the main dashboard. */}

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Voice Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Headphones className="text-blue-500 mr-3" size={24} />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Voice Input</h2>
            </div>
            
            <div className="flex flex-col items-center space-y-6">
              <div className={`relative ${isRecording ? 'animate-pulse' : ''}`}>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                    isRecording
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
                  </div>
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-25"></div>
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <p className={`text-lg font-medium ${isRecording ? 'text-red-600' : 'text-gray-700'}`}>
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Speak clearly for best results
                </p>
              </div>
            </div>
          </div>

          {/* Text Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <MessageCircle className="text-green-500 mr-3" size={24} />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Text Input</h2>
            </div>
            
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question about the factory..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  disabled={isLoading}
                  rows={4}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !textInput.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                <Send size={20} />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center mb-8">
            <div className="bg-white rounded-2xl shadow-xl px-8 py-6 flex items-center space-x-4">
              <Loader className="animate-spin text-blue-500" size={28} />
              <span className="text-gray-700 text-lg font-medium">Processing your request...</span>
            </div>
          </div>
        )}

        {/* Response Section */}
        {response && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg mr-3">
                  <MessageCircle className="text-white" size={20} />
                </div>
                Assistant Response
              </h2>
              {audioUrl && (
                <button
                  onClick={playAudio}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Volume2 size={20} />
                  <span>Replay Audio</span>
                </button>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-800 text-lg leading-relaxed">{response}</p>
            </div>
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
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
          
          <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Example Questions:</h4>
            <div className="flex flex-wrap gap-2">
              {[
                '"What is the temperature of the Furnace?"',
                '"Which machines need maintenance?"',
                '"Show production data for today"',
                '"Are there any alerts?"',
                '"Turn on light one in the Machine Room."', // New example
                '"Record a sale of 50 cartons to John Doe."', // New example
                '"Stop the Labeller."' // New example
              ].map((example, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {example}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
