import React, { useState, useEffect } from "react";
import { palassapi } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Save, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PalassCharacter from "@/Components/PalassCharacter";
import { useAuth } from '@clerk/clerk-react';

export default function Home() {
  const [factText, setFactText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  
  const queryClient = useQueryClient();
  const { getToken } = useAuth();


  const { data: facts } = useQuery({
    queryKey: ['facts'],
    queryFn: () => palassapi.entities.Fact.list('-created_date'),
    initialData: [],
  });

  // Calculate and persist Palass size
  const calculateSize = (factCount) => {
    const baseSize = 120;
    const growthPerFact = 8;
    const maxSize = 220;
    return Math.min(baseSize + (factCount * growthPerFact), maxSize);
  };

  const characterSize = calculateSize(facts.length);

  const createFactMutation = useMutation({
    mutationFn: (factData) => palassapi.entities.Fact.create(factData),
    onSuccess: (newFact) => {
      // Update all fact queries
      queryClient.setQueryData(['facts'], (old) => [newFact, ...(old || [])]);
      queryClient.invalidateQueries({ queryKey: ['facts'] });
    },
  });

  const handleStore = async () => {
    if (!factText.trim()) return;

    // Show storing feedback
    setFeedbackMessage("Palass is learning...");
    setShowFeedback(true);

    try {
      // Get auth token from Clerk and store the fact via API
      const token = await getToken();
      const response = await palassapi.api.store(factText, token);
      if (response) {
        setFeedbackMessage("✨ Palass learned something new!");
        // Refresh the facts list by re-fetching
        queryClient.invalidateQueries({ queryKey: ['facts'] });
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
      const token = await getToken();
      const response = await palassapi.api.ask(factText, token);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl"
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-purple-500" />
            Mobile Palass
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Share facts with Palass and watch it grow!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-12"
        >
          <motion.div
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            key={characterSize}
          >
            <PalassCharacter size={characterSize} isThinking={isThinking} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={facts.length}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md"
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                <>Palass knows {facts.length === 0 ? "nothing." : <span className="font-bold text-purple-600">{facts.length} fact{facts.length == 1 ? '' : 's'}</span>}</>
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center mb-4"
            >
              <div className="inline-block px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                <p className="text-gray-700 dark:text-gray-200 font-medium">{feedbackMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8"
        >
          <Textarea
            value={factText}
            onChange={(e) => setFactText(e.target.value)}
            placeholder="Tell Palass something interesting..."
            className="min-h-32 text-lg border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-400 rounded-2xl resize-none mb-6 transition-all"
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
              className="flex-1 h-14 text-lg border-2 border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 dark:text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Brain className="w-5 h-5 mr-2" />
              Ask
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-gray-600 dark:text-gray-400 text-sm"
        >
          <p>💡 Store facts to help Palass grow • Ask questions to see Palass think</p>
        </motion.div>
      </div>
    </div>
  );
}