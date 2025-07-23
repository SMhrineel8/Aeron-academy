// src/components/QuizSection.tsx
import React, { useState } from 'react';
import { UploadCloud, FileText, BookOpen, Loader2 } from 'lucide-react';
import QuizComponent from '../QuizComponent'; // Ensure correct relative path

export default function QuizSection({
    quizzes,
    generateQuiz,
    searching,
    sageState,
    error,
    setError
}: any) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [customTopic, setCustomTopic] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            setError('');
            // Attempt to read text content from the file
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setFileContent(text);
                // Optionally, auto-set custom topic from file name
                setCustomTopic(file.name.split('.').slice(0, -1).join('.'));
            };
            reader.onerror = () => {
                setError("Failed to read file. Please try a different file.");
                setFileContent('');
            };
            reader.readAsText(file); // Only works for text-based files
        } else {
            setUploadedFile(null);
            setFileContent('');
            setCustomTopic('');
        }
    };

    const handleGenerateQuiz = () => {
        if (searching) return;

        let topicToSend = customTopic.trim();

        if (uploadedFile && fileContent.trim()) {
            // In a real scenario, you'd send fileContent to a backend or a more capable AI model
            // For now, we'll use a derived topic or the first few words if a topic isn't set.
            topicToSend = topicToSend || uploadedFile.name.split('.').slice(0, -1).join('.') || fileContent.substring(0, 50) + "...";
            alert("Note: For full functionality, processing of uploaded file content by AI for quiz generation typically requires a backend or advanced browser-side parsing (e.g., for PDFs). Currently, the quiz is generated based on the file name or derived topic.");
        } else if (!topicToSend) {
            setError("Please enter a topic or upload a text-based file to generate a quiz.");
            return;
        }

        generateQuiz(topicToSend); // Calls the generateQuiz function from App.tsx
        setCustomTopic(''); // Clear topic input after generation
        setUploadedFile(null); // Clear file input
        setFileContent('');
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">🧠 Interactive Quizzes</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Generate a new Quiz</h3>
                <p className="text-gray-600">Enter a topic, or upload a document (like a book chapter or paper) and we'll generate an interactive quiz for you!</p>

                {/* File Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document (TXT recommended for direct parsing)</label>
                    <div className="flex items-center space-x-3">
                        <input
                            type="file"
                            accept=".txt, .pdf, .docx" // Accepting common document types, but warning about TXT for direct parsing
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-purple-50 file:text-purple-700
                                hover:file:bg-purple-100"
                        />
                        {uploadedFile && (
                            <span className="text-gray-700 text-sm flex items-center">
                                <FileText className="w-4 h-4 mr-1" /> {uploadedFile.name}
                            </span>
                        )}
                    </div>
                    {uploadedFile && (
                        <p className="text-xs text-gray-500 mt-2">
                            Note: For PDFs/DOCX, actual content processing by AI would require backend services. Currently, only the file name/derived topic is used. TXT files allow direct content reading.
                        </p>
                    )}
                </div>

                {/* Or Enter Topic Manually */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Or enter a topic manually:</label>
                    <input
                        type="text"
                        placeholder="e.g., Quantum Physics, French Revolution, Supply Chain Management"
                        className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleGenerateQuiz}
                    disabled={searching || (!uploadedFile && !customTopic.trim())}
                    className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center space-x-2 transition-all
                        ${searching || (!uploadedFile && !customTopic.trim())
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                >
                    {searching ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Generating Quiz...</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="w-5 h-5" />
                            <span>Generate Quiz</span>
                        </>
                    )}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Display existing quizzes */}
            {quizzes.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800">Your Quizzes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {quizzes.map((quiz: any, idx: number) => (
                            <QuizComponent key={idx} quiz={quiz} />
                        ))}
                    </div>
                </div>
            )}
            {quizzes.length === 0 && !searching && (
                 <div className="text-center py-10 text-gray-600">
                    <p>No quizzes generated yet. Start by entering a topic or uploading a document above!</p>
                 </div>
            )}
        </div>
    );
}
