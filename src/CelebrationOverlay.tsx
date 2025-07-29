// src/CelebrationOverlay.tsx
import React from 'react';
import { Sparkles } from 'lucide-react'; // Assuming you use Sparkles icon for celebration

// Define the props interface for CelebrationOverlay
interface CelebrationOverlayProps {
    show: boolean;
    message: string; // Added this prop
    setShow: React.Dispatch<React.SetStateAction<boolean>>; // Added this prop
}

const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ show, message, setShow }) => {
    if (!show) return null;

    // This is the updated structure based on your current `CelebrationOverlay.tsx`
    // from Code app.docx, with the added message and setShow functionality.
    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            <div className="relative">
                {[...Array(20)].map((_, i) => (
                    <div key={i}
                         className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-confetti"
                         style={{
                             left: `${Math.random() * 100}px`,
                             top: `${Math.random() * 100}px`,
                             animationDelay: `${Math.random() * 2}s`,
                             animationDuration: `${2 + Math.random() * 2}s`
                         }}/>
                ))}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4
                                rounded-2xl shadow transform scale-110 animate-celebration pointer-events-auto"> {/* Added pointer-events-auto */}
                    <div className="text-center">
                        <div className="text-4xl mb-2">🎉</div>
                        <div className="text-xl font-bold">{message}</div> {/* Use the message prop */}
                        <div className="text-sm opacity-90">Keep going!</div>
                        {/* Add a button to close the celebration if needed, or let it auto-close */}
                        <button
                            onClick={() => setShow(false)}
                            className="mt-4 bg-white bg-opacity-30 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-50 transition-all"
                        >
                            Got It!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CelebrationOverlay;
