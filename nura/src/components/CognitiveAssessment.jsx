import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  ArrowRight,
  Brain,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import VoiceInput from '../components/VoiceInput';
import { fetchCognitiveTest, submitCognitiveTest } from './mockCognitiveAPI';

export default function CognitiveAssessment({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTest();
  }, []);

  const loadTest = async () => {
    try {
      setLoading(true);
      const testQuestions = await fetchCognitiveTest();
      setQuestions(testQuestions);
      setLoading(false);
    } catch (err) {
      setError('Failed to load the assessment. Please try again.');
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleTextAnswer = (value) => {
    setCurrentAnswer(value);
  };

  const handleVoiceTranscript = (transcript) => {
    setCurrentAnswer(transcript);
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = [...answers, {
      question_id: currentQuestion.id,
      answer: currentAnswer.trim()
    }];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (isLastQuestion) {
      submitTest(newAnswers);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const submitTest = async (finalAnswers) => {
    try {
      setSubmitting(true);
      const result = await submitCognitiveTest(finalAnswers);
      setResults(result);
    } catch (err) {
      setError('Failed to evaluate the assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center bg-white border-0 shadow-xl rounded-3xl">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Preparing Your Assessment
          </h2>
          <p className="text-xl text-gray-600">
            Loading questions...
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center bg-white border-2 border-red-200 rounded-3xl">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Something Went Wrong
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {error}
          </p>
          <Button
            onClick={onBack}
            className="py-6 px-8 text-xl bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl"
          >
            <Home className="w-6 h-6 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (results) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="p-10 bg-white border-0 shadow-2xl rounded-3xl">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <div className="text-center">
                <div className="text-5xl font-bold text-white">{results.score}</div>
                <div className="text-sm text-white/90">out of 100</div>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Assessment Complete!
            </h2>
          </div>

          {/* Summary */}
          <div className="space-y-6 mb-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Summary</h3>
                  <p className="text-lg text-blue-800 leading-relaxed">
                    {results.summary}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">Recommendation</h3>
                  <p className="text-lg text-green-800 leading-relaxed">
                    {results.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-4">Performance Areas</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(results.detailed_analysis).map(([area, status]) => (
                  <div key={area} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      status === 'Good' || status === 'Normal' || status === 'Adequate'
                        ? 'bg-green-100'
                        : 'bg-orange-100'
                    }`}>
                      <CheckCircle2 className={`w-8 h-8 ${
                        status === 'Good' || status === 'Normal' || status === 'Adequate'
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }`} />
                    </div>
                    <p className="text-sm font-medium text-gray-600 capitalize mb-1">
                      {area.replace(/_/g, ' ')}
                    </p>
                    <p className={`text-base font-bold ${
                      status === 'Good' || status === 'Normal' || status === 'Adequate'
                        ? 'text-green-700'
                        : 'text-orange-700'
                    }`}>
                      {status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={onBack}
            className="w-full py-8 text-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl shadow-lg"
          >
            <Home className="w-7 h-7 mr-3" />
            Back to Home
          </Button>
        </Card>
      </motion.div>
    );
  }

  if (submitting) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center bg-white border-0 shadow-xl rounded-3xl">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Evaluating Your Responses
          </h2>
          <p className="text-xl text-gray-600">
            Please wait while we analyze your answers...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          onClick={onBack}
          variant="outline"
          className="py-6 px-6 text-xl border-2 rounded-2xl"
        >
          <Home className="w-6 h-6 mr-2" />
          Exit
        </Button>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Question</div>
          <div className="text-2xl font-bold text-gray-800">
            {currentIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div className="w-32" /> {/* Spacer for alignment */}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 bg-white border-0 shadow-xl rounded-3xl mb-8">
            {/* Question */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-base font-medium mb-4">
                  {currentQuestion.context.replace(/_/g, ' ').toUpperCase()}
                </div>
                <h2 className="text-3xl font-semibold text-gray-800 leading-snug">
                  {currentQuestion.question}
                </h2>
              </div>
            </div>

            {/* Input Area */}
            {currentQuestion.type === 'text' ? (
              <div className="space-y-6">
                <Input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => handleTextAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && currentAnswer.trim() && handleNext()}
                  placeholder="Type your answer here..."
                  className="w-full text-2xl py-8 px-6 border-2 border-gray-200 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  autoFocus
                />
                
                <Button
                  onClick={handleNext}
                  disabled={!currentAnswer.trim()}
                  className="w-full py-8 text-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl shadow-lg disabled:opacity-50"
                >
                  {isLastQuestion ? 'Submit Assessment' : 'Next Question'}
                  <ArrowRight className="w-7 h-7 ml-3" />
                </Button>
              </div>
            ) : (
              <VoiceInput
                onTranscriptComplete={(transcript) => {
                  handleVoiceTranscript(transcript);
                  // Auto-advance after confirmation
                  setTimeout(handleNext, 500);
                }}
                questionId={currentQuestion.id}
              />
            )}
          </Card>

          {/* Help Text */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
            <p className="text-lg text-amber-800">
              <strong>Remember:</strong> Take your time and answer as best as you can. There are no wrong answers.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}