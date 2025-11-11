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
// Fix: Extracted inline type to a named interface `AIStudio` to resolve declaration conflict.
interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
}
declare global {
    interface Window {
        aistudio?: AIStudio;
    }
}

function App() {
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeyConfigured(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleConfigureApiKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      // Assume key selection was successful to update UI immediately
      setIsApiKeyConfigured(true);
    }
  };

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
                <AiToolkit isApiKeyConfigured={isApiKeyConfigured} onConfigureApiKey={handleConfigureApiKey} />
            </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
