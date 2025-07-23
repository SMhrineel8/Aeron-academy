// src/components/RankingsSection.tsx
import React from 'react';
import { Award, Medal, Trophy, Star } from 'lucide-react';

interface RankingsSectionProps {
    profile: any; // Assuming profile contains user's score, name etc.
}

export default function RankingsSection({ profile }: RankingsSectionProps) {
    // Placeholder data for leaderboards
    const globalLeaderboard = [
        { name: 'Alice Smith', score: 3500, rank: 1, avatar: 'https://i.pravatar.cc/50?img=1' },
        { name: 'Bob Johnson', score: 3200, rank: 2, avatar: 'https://i.pravatar.cc/50?img=2' },
        { name: profile.name, score: profile.totalPoints, rank: 3, avatar: 'https://i.pravatar.cc/50?img=6' }, // Your user
        { name: 'Charlie Brown', score: 2800, rank: 4, avatar: 'https://i.pravatar.cc/50?img=3' },
        { name: 'Diana Prince', score: 2600, rank: 5, avatar: 'https://i.pravatar.cc/50?img=4' },
    ].sort((a, b) => b.score - a.score); // Ensure sorted for ranks

    const categoryLeaderboard = [
        { name: 'Eve Adams', score: 1800, rank: 1, avatar: 'https://i.pravatar.cc/50?img=7' },
        { name: profile.name, score: profile.totalPoints / 2, rank: 2, avatar: 'https://i.pravatar.cc/50?img=6' }, // Your user (example, adjust logic)
        { name: 'Frank Green', score: 1500, rank: 3, avatar: 'https://i.pravatar.cc/50?img=8' },
    ];

    const userRankings = [
        { category: 'Overall', rank: 3, score: profile.totalPoints, icon: <Award className="text-blue-500" /> },
        { category: 'Programming', rank: 1, score: 950, icon: <Star className="text-yellow-500" /> },
        { category: 'Finance', rank: 12, score: 300, icon: <Medal className="text-gray-500" /> },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">🏆 Rankings & Competition</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Your Current Ranks</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {userRankings.map((item, idx) => (
                        <div key={idx} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center space-x-3">
                            {item.icon}
                            <div>
                                <p className="text-sm text-gray-600">{item.category}</p>
                                <p className="text-lg font-bold text-gray-800">Rank: {item.rank}</p>
                                <p className="text-sm text-gray-700">{item.score} Points</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Global Leaderboard */}
                <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Global Leaderboard</h3>
                    <ul className="space-y-3">
                        {globalLeaderboard.map((user, idx) => (
                            <li key={idx} className={`flex items-center justify-between p-3 rounded-lg ${user.name === profile.name ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'}`}>
                                <div className="flex items-center space-x-3">
                                    <span className="font-bold text-lg text-gray-700 w-6 text-center">{user.rank}.</span>
                                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border-2 border-purple-300" />
                                    <span className="font-medium text-gray-800">{user.name}</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-700">{user.score} pts</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Category Leaderboard (Example: Programming) */}
                <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Programming Leaderboard</h3>
                    <ul className="space-y-3">
                        {categoryLeaderboard.map((user, idx) => (
                            <li key={idx} className={`flex items-center justify-between p-3 rounded-lg ${user.name === profile.name ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50'}`}>
                                <div className="flex items-center space-x-3">
                                    <span className="font-bold text-lg text-gray-700 w-6 text-center">{user.rank}.</span>
                                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border-2 border-purple-300" />
                                    <span className="font-medium text-gray-800">{user.name}</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-700">{user.score} pts</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <p className="text-center text-gray-600 text-sm mt-8">
                Compete with others and climb the ranks across various learning categories!
            </p>
        </div>
    );
}
