import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getMemoryQuestions } from './mockUserDataAPI';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw,
  Lightbulb,
  Heart,
  Home
} from 'lucide-react';

export default function MemoryTraining({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    const allQuestions = getMemoryQuestions();
    // Shuffle and pick 5 random questions for a session
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
  }, []);

  const currentQuestion = questions[currentIndex];

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const correct = currentQuestion.alternativeAnswers.some(
      ans => ans.toLowerCase() === userAnswer.trim().toLowerCase()
    );
    
    setIsCorrect(correct);
    setShowResult(true);
    setScore(prev => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
      setShowHint(false);
    } else {
      setSessionComplete(true);
    }
  };

  const restartSession = () => {
    const allQuestions = getMemoryQuestions();
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
    setCurrentIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setShowHint(false);
    setScore({ correct: 0, total: 0 });
    setSessionComplete(false);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-gray-600">Loading questions...</div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-10 text-center bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Heart className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Wonderful Job!
          </h2>
          
          <p className="text-2xl text-gray-600 mb-8">
            You got <span className="font-bold text-green-600">{score.correct}</span> out of <span className="font-bold">{score.total}</span> correct
          </p>
          
          <p className="text-xl text-gray-500 mb-10">
            Every practice session helps keep your memories strong. You're doing great!
          </p>
          
          <div className="flex flex-col gap-4">
            <Button 
              onClick={restartSession}
              className="w-full py-8 text-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl shadow-lg"
            >
              <RotateCcw className="w-7 h-7 mr-3" />
              Practice Again
            </Button>
            
            <Button 
              onClick={onBack}
              variant="outline"
              className="w-full py-8 text-2xl border-2 border-gray-300 rounded-2xl"
            >
              <Home className="w-7 h-7 mr-3" />
              Go Home
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl text-gray-600">Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-xl text-gray-600 bg-blue-100 px-4 py-2 rounded-full">
            {currentQuestion.category}
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 bg-white border-0 shadow-xl rounded-3xl">
            {/* Question */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 leading-snug pt-2">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 flex items-center gap-4">
                    <Lightbulb className="w-8 h-8 text-amber-500 flex-shrink-0" />
                    <span className="text-xl text-amber-800">
                      <strong>Hint:</strong> {currentQuestion.hint}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer input */}
            {!showResult && (
              <>
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  placeholder="Type your answer here..."
                  className="w-full text-2xl py-8 px-6 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 mb-6"
                  autoFocus
                />

                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowHint(true)}
                    variant="outline"
                    className="flex-1 py-7 text-xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 rounded-2xl"
                    disabled={showHint}
                  >
                    <Lightbulb className="w-6 h-6 mr-2" />
                    Show Hint
                  </Button>
                  
                  <Button
                    onClick={checkAnswer}
                    className="flex-1 py-7 text-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl shadow-lg"
                    disabled={!userAnswer.trim()}
                  >
                    Check Answer
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </div>
              </>
            )}

            {/* Result with image */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`p-6 rounded-2xl mb-6 ${
                    isCorrect 
                      ? 'bg-green-50 border-2 border-green-200' 
                      : 'bg-orange-50 border-2 border-orange-200'
                  }`}>
                    <div className="flex items-center gap-4 mb-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      ) : (
                        <XCircle className="w-10 h-10 text-orange-500" />
                      )}
                      <span className={`text-2xl font-bold ${
                        isCorrect ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        {isCorrect ? "That's right! Great job!" : "Not quite, but that's okay!"}
                      </span>
                    </div>
                    
                    {!isCorrect && (
                      <p className="text-xl text-gray-700 ml-14 mb-4">
                        The answer is: <strong className="text-gray-900">{currentQuestion.answer}</strong>
                      </p>
                    )}

                    {/* Image related to the question */}
                    {currentQuestion.imageUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 rounded-2xl overflow-hidden shadow-lg"
                      >
                        <img 
                          src={currentQuestion.imageUrl} 
                          alt={currentQuestion.category}
                          className="w-full h-64 object-cover"
                        />
                        <div className="bg-white p-4 text-center">
                          <p className="text-lg text-gray-600">
                            {isCorrect ? '🎉 This reminds you of your answer!' : '💭 A helpful reminder'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <Button
                    onClick={nextQuestion}
                    className="w-full py-8 text-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl shadow-lg"
                  >
                    {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                    <ArrowRight className="w-7 h-7 ml-3" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}