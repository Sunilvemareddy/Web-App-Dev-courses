import React, { useState, useCallback } from 'react';
import { Month, Week, Resource } from '../types';
import { ROADMAP_DATA, BookOpenIcon, CodeBracketIcon, SparklesIcon, LoadingSpinner } from '../constants';
import { fetchLearningResources } from '../services/geminiService';

interface ResourceDisplayProps {
    resource: Resource;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resource }) => {
    return (
        <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <p className="text-gray-300 whitespace-pre-wrap">{resource.text}</p>
            {resource.sources && resource.sources.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold text-cyan-400">Sources:</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        {resource.sources.map((source, index) => (
                            <li key={index}>
                                <a href={source.web?.uri || source.maps?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    {source.web?.title || source.maps?.title || 'Untitled Source'}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


interface WeekItemProps {
    week: Week;
}

const WeekItem: React.FC<WeekItemProps> = ({ week }) => {
    const [resource, setResource] = useState<Resource | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFindResources = useCallback(async () => {
        if (resource) {
            // Toggle off if already open
            setResource(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchLearningResources(week.learning);
            setResource(result);
        } catch (err) {
            setError('Failed to fetch resources.');
        } finally {
            setIsLoading(false);
        }
    }, [week.learning, resource]);

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 transition-all duration-300 hover:border-cyan-500/50 hover:bg-gray-800">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold bg-cyan-900/50 text-cyan-300 py-1 px-2 rounded-full">WEEK {week.week}</span>
                    </div>
                    <div className="flex items-start gap-3 mt-3">
                        <BookOpenIcon className="w-5 h-5 mt-1 text-gray-400 shrink-0" />
                        <p className="font-semibold text-gray-100">{week.learning}</p>
                    </div>
                    <div className="flex items-start gap-3 mt-2">
                        <CodeBracketIcon className="w-5 h-5 mt-1 text-gray-400 shrink-0" />
                        <p className="text-gray-400">{week.practice}</p>
                    </div>
                </div>
                <button
                    onClick={handleFindResources}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-cyan-600 text-white px-3 py-2 rounded-md hover:bg-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm font-semibold shrink-0"
                >
                    <SparklesIcon className="w-4 h-4" />
                    <span>{resource ? 'Hide' : 'Resources'}</span>
                </button>
            </div>
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-400 mt-4">{error}</p>}
            {resource && !isLoading && <ResourceDisplay resource={resource} />}
        </div>
    );
};


interface MonthCardProps {
    month: Month;
}
const MonthCard: React.FC<MonthCardProps> = ({ month }) => (
     <div className="mb-8">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 pb-2 border-b-2 border-gray-700">{month.title}</h2>
        <div className="space-y-4">
            {month.weeks.map((week) => (
                <WeekItem key={`${month.title}-${week.week}`} week={week} />
            ))}
        </div>
    </div>
);


const RoadmapDisplay: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-center mb-2 text-white">6-Month Learning Plan</h1>
            <p className="text-center text-gray-400 mb-12">Your interactive roadmap to becoming a Web & App Developer.</p>
            {ROADMAP_DATA.map((month) => (
                <MonthCard key={month.title} month={month} />
            ))}
        </div>
    );
}

export default RoadmapDisplay;
