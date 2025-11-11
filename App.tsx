// Fix: Add triple-slash directive to provide types for import.meta.env.
/// <reference types="vite/client" />

import React, { useState, useEffect } from 'react';
import RoadmapDisplay from './components/RoadmapDisplay';
import AiToolkit from './components/AiToolkit';

const Header: React.FC = () => (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <span className="font-bold text-xl text-white">
                        SVR <span className="text-cyan-400">Study Circle</span>
                    </span>
                </div>
            </div>
        </div>
    </header>
);

// Add a type declaration for the aistudio object on the window
// Fix: Moved AIStudio interface inside declare global to resolve declaration conflict.
declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }
    interface Window {
        aistudio?: AIStudio;
    }
}

function App() {
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(false);

  useEffect(() => {
    // In a Vite project, environment variables prefixed with VITE_ are exposed to the client-side code.
    // We check for the presence of this variable to determine if the API key is configured.
    const checkApiKey = () => {
        const hasKey = !!import.meta.env.VITE_API_KEY;
        setIsApiKeyConfigured(hasKey);
    };
    checkApiKey();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main>
        <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
                <RoadmapDisplay />
            </div>
            <aside className="lg:w-1/2 lg:sticky lg:top-20 self-start">
                 <h2 className="text-3xl font-bold text-center mb-4 text-white">AI Learning Toolkit</h2>
                <AiToolkit isApiKeyConfigured={isApiKeyConfigured} />
            </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
