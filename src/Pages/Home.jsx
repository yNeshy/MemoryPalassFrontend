import React, { useState, useEffect } from "react";
import { base44 } from "@/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Save, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PalassCharacter from "@/Components/PalassCharacter";
import { useAuth } from '@clerk/clerk-react';


export default function Home() {
  const [factText, setFactText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [characterSize, setCharacterSize] = useState(120);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { getToken } = useAuth();

  const ask = async (question) => {
    const token = await getToken();
    const response = await fetch('http://localhost:8000/api/memory?' + new URLSearchParams({
      question: question,
    }).toString(), {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get answer: ${response.status}`);
    }
    
    const data = await response.json();
    return data.answer;
  };

  const store = async (fact) => {
    const token = await getToken();
    const response = await fetch('http://localhost:8000/api/memory', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ 'text': fact })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to store fact: ${response.status}`);
    }
    
    return await response.json();
  };

  const { data: facts = [] } = base44.entities.Fact.list();  

  // Adjust character size based on number of facts
  useEffect(() => {
    const baseSize = 120;
    const growthPerFact = 8;
    const maxSize = 220;
    const newSize = Math.min(baseSize + (facts.length * growthPerFact), maxSize);
    setCharacterSize(newSize);
  }, [facts.length]);

  const handleStore = async () => {
    if (!factText.trim()) return;

    // Show storing feedback
    setFeedbackMessage("Palass is learning...");
    setShowFeedback(true);

    try {
      // Store the fact
      const response = await store(factText);
      if (response) {
        setFeedbackMessage("✨ Palass learned something new!");
        // Refresh the facts list by re-fetching
        await base44.entities.Fact.list();
      } else {
        setFeedbackMessage("❌ Failed to store the fact: No response from server");
      }
    } catch (error) {
      setFeedbackMessage(`❌ ${error.message}`);
    } finally {
      setTimeout(() => {
        setShowFeedback(false);
        setFactText("");
      }, 2000);
    }
  };

  const handleAsk = async () => {
    if (!factText.trim()) return;

    // Show thinking animation
    setIsThinking(true);
    setFeedbackMessage("Palass is thinking...");
    setShowFeedback(true);

    try {
      const response = await ask(factText);
      setIsThinking(false);
      if (response) {
        setFeedbackMessage(response);
      } else {
        setFeedbackMessage("🤔 No answer found");
      }
    } catch (error) {
      setFeedbackMessage(`❌ ${error.message}`);
    } finally {
      setIsThinking(false);
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-purple-500" />
            Mobile Palass
          </h1>
          <p className="text-gray-600 text-lg">
            Share facts with Palass and watch it grow!
          </p>
        </motion.div>

        {/* Character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-12"
        >
          <PalassCharacter size={characterSize} isThinking={isThinking} />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
                <>Palass knows {facts.length === 0 ? "nothing." : <span className="font-bold text-purple-600">{facts.length} fact{facts.length == 1 ? '' : 's'}</span>}</>
            </span>
          </div>
        </motion.div>

        {/* Feedback Message */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center mb-4"
            >
              <div className="inline-block px-6 py-3 bg-white rounded-full shadow-lg">
                <p className="text-gray-700 font-medium">{feedbackMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8"
        >
          <Textarea
            value={factText}
            onChange={(e) => setFactText(e.target.value)}
            placeholder="Tell Palass something interesting..."
            className="min-h-32 text-lg border-2 border-gray-200 focus:border-purple-400 rounded-2xl resize-none mb-6 transition-all"
            disabled={isThinking}
          />

          <div className="flex gap-4">
            <Button
              onClick={handleStore}
              disabled={!factText.trim() || isThinking}
              className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Save className="w-5 h-5 mr-2" />
              Store
            </Button>
            <Button
              onClick={handleAsk}
              disabled={!factText.trim() || isThinking}
              variant="outline"
              className="flex-1 h-14 text-lg border-2 border-purple-300 hover:bg-purple-50 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Brain className="w-5 h-5 mr-2" />
              Ask
            </Button>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-gray-600 text-sm"
        >
          <p>💡 Store facts to help Palass grow • Ask questions to see Palass think</p>
        </motion.div>
      </div>
    </div>
  );
}