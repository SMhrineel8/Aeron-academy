import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface Quiz {
    title: string;
    description: string;
    questions: QuizQuestion[];
}

export default function QuizComponent({ quiz }: { quiz: Quiz }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerSelect = (option: string) => {
        setSelectedAnswer(option);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === quiz.questions[currentQuestionIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }
        setShowResult(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            // Quiz finished, maybe show a final score summary or reset
            alert(`Quiz finished! You scored ${score} out of ${quiz.questions.length}`);
            setCurrentQuestionIndex(0);
            setSelectedAnswer(null);
            setShowResult(false);
            setScore(0);
        }
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 space-y-5">
            <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
            <p className="text-gray-600">{quiz.description}</p>

            {currentQuestion ? (
                <div className="space-y-4">
                    <p className="font-semibold text-lg text-gray-700">
                        {currentQuestionIndex + 1}. {currentQuestion.question}
                    </p>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={showResult}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-all
                                    ${selectedAnswer === option ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}
                                    ${showResult && option === currentQuestion.correctAnswer ? 'bg-green-100 border-green-400' : ''}
                                    ${showResult && selectedAnswer === option && selectedAnswer !== currentQuestion.correctAnswer ? 'bg-red-100 border-red-400' : ''}
                                `}
                            >
                                {option}
                                {showResult && option === currentQuestion.correctAnswer && (
                                    <CheckCircle className="inline-block ml-2 text-green-600 w-4 h-4" />
                                )}
                                {showResult && selectedAnswer === option && selectedAnswer !== currentQuestion.correctAnswer && (
                                    <XCircle className="inline-block ml-2 text-red-600 w-4 h-4" />
                                )}
                            </button>
                        ))}
                    </div>

                    {!showResult ? (
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={!selectedAnswer}
                            className={`w-full py-3 rounded-lg font-medium text-white transition-all
                                ${selectedAnswer ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}
                            `}
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="w-full py-3 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-all"
                        >
                            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    )}
                </div>
            ) : (
                <p className="text-gray-600">No questions found for this quiz.</p>
            )}

            {showResult && (
                <div className="mt-4 text-center text-sm text-gray-700">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                        <p className="text-green-600 font-semibold">Correct! 🎉</p>
                    ) : (
                        <p className="text-red-600 font-semibold">Incorrect. The correct answer was: {currentQuestion.correctAnswer}</p>
                    )}
                </div>
            )}
            <div className="text-sm text-gray-500 text-center">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
        </div>
    );
}
