import React from 'react';
import { Month } from './types';

export const ROADMAP_DATA: Month[] = [
    {
        title: 'Month 1 - Web Basics (HTML, CSS, JS)',
        weeks: [
            { week: 1, learning: 'Learn HTML basics and build a profile page', practice: 'Practice simple webpage' },
            { week: 2, learning: 'Learn CSS basics (colors, layout, Flexbox)', practice: 'Style profile page' },
            { week: 3, learning: 'Learn JavaScript basics (variables, DOM)', practice: 'Add interactivity (button/popup)' },
            { week: 4, learning: 'Build a To-Do List app', practice: 'Functional To-Do app' },
        ],
    },
    {
        title: 'Month 2 – Modern Frontend (React + Tailwind)',
        weeks: [
            { week: 5, learning: 'Install Node.js, learn React basics', practice: 'React Hello World app' },
            { week: 6, learning: 'React hooks, build Weather App with API', practice: 'Weather App' },
            { week: 7, learning: 'Learn Tailwind CSS and style app', practice: 'Styled Weather App' },
            { week: 8, learning: 'Mini-project: Student Dashboard', practice: 'Student Dashboard App' },
        ],
    },
    {
        title: 'Month 3 – Next.js + GitHub',
        weeks: [
            { week: 9, learning: 'Learn Next.js basics (pages, routing)', practice: 'Basic Next.js app' },
            { week: 10, learning: 'Fetch data in Next.js', practice: 'Crypto Price App' },
            { week: 11, learning: 'Learn Git + GitHub', practice: 'Push code to repo' },
            { week: 12, learning: 'Deploy with Vercel', practice: 'Live deployed app' },
        ],
    },
    {
        title: 'Month 4 - Backend & APIs',
        weeks: [
            { week: 13, learning: 'Learn Node.js + Express', practice: 'Basic JSON API' },
            { week: 14, learning: 'Connect Express with PostgreSQL/MongoDB', practice: 'Student Records API' },
            { week: 15, learning: 'Learn REST API design', practice: 'CRUD API project' },
            { week: 16, learning: 'Build Library App (Full stack)', practice: 'Library App' },
        ],
    },
    {
        title: 'Month 5 – AI Tools + Testing',
        weeks: [
            { week: 17, learning: 'Learn prompting with Stitch', practice: 'Blog/Notes app in Stitch' },
            { week: 18, learning: 'Explore GitHub Copilot', practice: 'Refactor code with AI' },
            { week: 19, learning: 'Learn Cypress basics', practice: 'Write automated tests' },
            { week: 20, learning: 'Cross-device + accessibility testing', practice: 'Accessible app' },
        ],
    },
    {
        title: 'Month 6 - Capstone Project (Study Abroad App)',
        weeks: [
            { week: 21, learning: 'Setup GitHub repo, design homepage', practice: 'World map + sidebar' },
            { week: 22, learning: 'Add country pages with QS data', practice: 'Country ranking pages' },
            { week: 23, learning: 'Add subject pages (Engineering, Finance)', practice: 'Subject-specific lists' },
            { week: 24, learning: 'Final testing & deployment', practice: 'Live Study Abroad App' },
        ],
    },
];

export const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-7.184c0-1.681.673-3.18 1.815-4.232ZM15.75 12.75a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008ZM12.75 9a.75.75 0 0 0-.75.75v.008a.75.75 0 0 0 .75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008Z" clipRule="evenodd" />
    <path d="M7.06 8.603a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM-1.06 9.664a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06Z" />
  </svg>
);

export const BookOpenIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.052 0 4.105.713 6 2.121m6-16.458a8.967 8.967 0 0 1-6 2.292c-1.052 0-2.062-.18-3-.512v14.25A8.987 8.987 0 0 0 18 18c-2.052 0-4.105-.713-6-2.121m0 0v-3.636c0-.552.448-1 1-1h4c.552 0 1 .448 1 1v3.636m0-3.636a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1m0 0H9.75m0 0c-.552 0-1-.448-1-1V8.25c0-.552.448-1 1-1h4.5c.552 0 1 .448 1 1v3.636m0 0A2.25 2.25 0 0 1 15 15.121V12a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v.75" />
    </svg>
);

export const CodeBracketIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 15" />
    </svg>
);

export const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
    </div>
);
