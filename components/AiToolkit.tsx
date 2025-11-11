import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AiTool, AspectRatio, ChatMessage, Resource } from '../types';
import { getAiTutorResponse, generateImage, findLocalStudySpots, generateSpeech } from '../services/geminiService';
import { LoadingSpinner } from '../constants';

const AiTutor: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello! I'm your AI Tutor. How can I help you with your studies today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useThinkingMode, setUseThinkingMode] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const prompt = `You are an expert programming tutor. The user's message is: "${input}". Previous conversation: ${JSON.stringify(messages.slice(-4))}`;
        const response = await getAiTutorResponse(prompt, useThinkingMode);
        
        setMessages([...newMessages, { role: 'model', content: response }]);
        setIsLoading(false);
    };
    
    const handlePlayAudio = (text: string) => {
        generateSpeech(text);
    };

    return (
        <div className="flex flex-col h-full bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center shrink-0 font-bold">AI</div>}
                        <div className={`relative group max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                           <p className="whitespace-pre-wrap">{msg.content}</p>
                            {msg.role === 'model' && (
                                <button onClick={() => handlePlayAudio(msg.content)} className="absolute -bottom-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-gray-600 hover:bg-gray-500">
                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white"><path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" /></svg>
                                </button>
                            )}
                        </div>
                        {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 font-bold">You</div>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center shrink-0 font-bold">AI</div>
                         <div className="p-3 rounded-lg bg-gray-700"><LoadingSpinner /></div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700/50">
                 <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id="thinking-mode" checked={useThinkingMode} onChange={(e) => setUseThinkingMode(e.target.checked)} className="accent-cyan-500"/>
                    <label htmlFor="thinking-mode" className="text-sm text-gray-300">Enable Thinking Mode (for complex queries)</label>
                 </div>
                 <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    <button onClick={handleSend} className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 transition-colors disabled:bg-gray-600">Send</button>
                </div>
            </div>
        </div>
    );
};

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsLoading(true);
        setImageUrl(null);
        const result = await generateImage(prompt, aspectRatio);
        setImageUrl(result);
        setIsLoading(false);
    };

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A visual representation of the React component lifecycle"
                    className="w-full h-24 bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <div className="flex gap-4 items-center">
                    <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                        className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    >
                        <option value="1:1">1:1 (Square)</option>
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                        <option value="4:3">4:3</option>
                        <option value="3:4">3:4</option>
                    </select>
                    <button type="submit" disabled={isLoading} className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 transition-colors disabled:bg-gray-600">Generate</button>
                </div>
            </form>
            <div className="mt-4 flex justify-center items-center h-96 bg-gray-900 rounded-md">
                {isLoading && <LoadingSpinner />}
                {imageUrl && <img src={imageUrl} alt={prompt} className="max-h-full max-w-full object-contain rounded-md" />}
                {!isLoading && !imageUrl && <p className="text-gray-500">Image will appear here</p>}
            </div>
        </div>
    );
};

const StudySpotFinder: React.FC = () => {
    const [query, setQuery] = useState('quiet cafes with wifi');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<Resource | null>(null);

    const handleFind = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setResults(null);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const res = await findLocalStudySpots(query, position.coords);
                setResults(res);
                setIsLoading(false);
            },
            (err) => {
                setError(`Geolocation error: ${err.message}`);
                setIsLoading(false);
            }
        );
    }, [query]);

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <button onClick={handleFind} disabled={isLoading} className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-500 transition-colors disabled:bg-gray-600">Find Spots</button>
            </div>
            <div className="mt-4">
                {isLoading && <LoadingSpinner />}
                {error && <p className="text-red-400">{error}</p>}
                {results && (
                     <div className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-gray-300 whitespace-pre-wrap">{results.text}</p>
                        {results.sources && results.sources.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold text-cyan-400">Places on Maps:</h4>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    {results.sources.map((source, index) => (
                                        <li key={index}>
                                            <a href={source.maps?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                {source.maps?.title || 'Untitled Location'}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const AiToolkit: React.FC = () => {
    const [activeTool, setActiveTool] = useState<AiTool>(AiTool.Tutor);

    const renderTool = () => {
        switch (activeTool) {
            case AiTool.Tutor:
                return <AiTutor />;
            case AiTool.ImageGen:
                return <ImageGenerator />;
            case AiTool.StudySpots:
                return <StudySpotFinder />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-2xl h-[70vh] flex flex-col">
            <div className="flex border-b border-gray-700">
                {(Object.values(AiTool)).map(tool => (
                    <button
                        key={tool}
                        onClick={() => setActiveTool(tool)}
                        className={`px-4 py-2 font-semibold text-sm transition-colors ${
                            activeTool === tool
                                ? 'border-b-2 border-cyan-500 text-cyan-400'
                                : 'text-gray-400 hover:bg-gray-800'
                        }`}
                    >
                        {tool}
                    </button>
                ))}
            </div>
            <div className="flex-1 mt-4">
                {renderTool()}
            </div>
        </div>
    );
};

export default AiToolkit;