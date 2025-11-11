import React from 'react';
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

function App() {
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
                <AiToolkit />
            </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
