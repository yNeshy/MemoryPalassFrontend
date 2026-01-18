import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  MessageCircleQuestion, 
  ArrowLeft,
  Sparkles,
  Heart,
  Calendar,
  Settings as SettingsIcon,
  Clock,
  Activity,
  Menu,
  X
} from 'lucide-react';
import MemoryTraining from '@/components/MemoryTraining';
import LifeAssistant from '@/components/LifeAssistant';
import DailyPractice from '@/components/DailyPractice';
import MemoryTimeline from '@/components/MemoryTimeline';
import CognitiveAssessment from '@/components/CognitiveAssessment';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [activeMode, setActiveMode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    setActiveMode(null);
  };

  const handleNavigation = (mode) => {
    setActiveMode(mode);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              className="fixed top-4 left-4 md:top-6 md:left-6 z-50 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl"
            >
              <Menu className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[400px] md:w-[500px] p-0 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="h-full flex flex-col p-4 sm:p-6 md:p-8">
              {/* Sidebar Header */}
              <div className="mb-6 md:mb-10">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-4 md:mb-6 shadow-xl">
                  <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-white" />
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-1 md:mb-2">Menu</h2>
                <p className="text-base md:text-xl text-gray-600">Choose an activity</p>
              </div>

              {/* Navigation Items */}
              <div className="space-y-3 md:space-y-4 flex-1">
                <button
                  onClick={() => handleNavigation('timeline')}
                  className="w-full p-4 md:p-6 bg-white hover:bg-gray-50 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-amber-300"
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-0.5 md:mb-1">Memory Timeline</h3>
                      <p className="text-sm md:text-lg text-gray-600">Explore your life story</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigation('assistant')}
                  className="w-full p-4 md:p-6 bg-white hover:bg-gray-50 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-purple-300"
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <MessageCircleQuestion className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-0.5 md:mb-1">Ask Me Anything</h3>
                      <p className="text-sm md:text-lg text-gray-600">Get answers about your life</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigation('assessment')}
                  className="w-full p-4 md:p-6 bg-white hover:bg-gray-50 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-indigo-300"
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Activity className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-0.5 md:mb-1">Cognitive Test</h3>
                      <p className="text-sm md:text-lg text-gray-600">Check your cognitive health</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Settings at bottom */}
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  navigate(createPageUrl('Settings'));
                }}
                className="w-full p-4 md:p-6 bg-white hover:bg-gray-50 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-gray-200"
              >
                <div className="flex items-center gap-3 md:gap-5">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-2xl font-bold text-gray-800">Settings</h3>
                  </div>
                </div>
              </button>
            </div>
          </SheetContent>
        </Sheet>

        <AnimatePresence mode="wait">
          {!activeMode ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Simple Header */}
              <div className="text-center mb-8 md:mb-16 pt-4 md:pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-2xl"
                >
                  <Sparkles className="w-10 h-10 md:w-16 md:h-16 text-white" />
                </motion.div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-3 md:mb-6">
                  Memory Friend
                </h1>
                <p className="text-lg md:text-3xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                  Your gentle companion for memory care
                </p>
              </div>

              {/* Single Daily Practice Card - Centered */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl mx-auto px-4"
              >
                <Card 
                  className="p-6 md:p-12 cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl md:rounded-3xl group hover:-translate-y-2"
                  onClick={() => setActiveMode('daily')}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-xl group-hover:scale-110 transition-transform">
                      <Calendar className="w-10 h-10 md:w-16 md:h-16 text-white" />
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-6">
                      Daily Practice
                    </h2>
                    
                    <p className="text-lg md:text-3xl text-gray-600 mb-6 md:mb-10 leading-relaxed">
                      5 simple questions to keep your memory strong
                    </p>
                    
                    <Button className="w-full py-6 md:py-10 text-xl md:text-3xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl md:rounded-3xl shadow-xl group-hover:shadow-2xl transition-all">
                      Start Today's Practice
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Simple message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-8 md:mt-16 px-4"
              >
                <p className="text-base md:text-2xl text-gray-500 mb-3 md:mb-4">
                  Use the menu button to explore more activities
                </p>
                <div className="inline-flex items-center gap-2 md:gap-3 bg-white px-6 md:px-10 py-3 md:py-5 rounded-full shadow-lg">
                  <Heart className="w-5 h-5 md:w-8 md:h-8 text-red-400" />
                  <span className="text-lg md:text-2xl text-gray-700">Take your time</span>
                  <Heart className="w-5 h-5 md:w-8 md:h-8 text-red-400" />
                </div>
              </motion.div>
            </motion.div>
          ) : activeMode === 'daily' ? (
            <motion.div
              key="daily"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back button */}
              <Button
                onClick={handleBack}
                variant="outline"
                className="mb-8 py-6 px-6 text-xl border-2 rounded-2xl"
              >
                <ArrowLeft className="w-6 h-6 mr-2" />
                Back to Home
              </Button>

              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Daily Practice</h1>
                <p className="text-xl text-gray-600">5 questions to keep your memory strong</p>
              </div>

              <DailyPractice onBack={handleBack} />
            </motion.div>
          ) : activeMode === 'assessment' ? (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Cognitive Health Assessment</h1>
                <p className="text-xl text-gray-600">Answer questions using voice or text</p>
              </div>

              <CognitiveAssessment onBack={handleBack} />
            </motion.div>
          ) : activeMode === 'timeline' ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Life Story</h1>
                <p className="text-xl text-gray-600">Journey through your precious memories</p>
              </div>

              <MemoryTimeline onBack={handleBack} />
            </motion.div>
          ) : activeMode === 'training' ? (
            <motion.div
              key="training"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back button */}
              <Button
                onClick={handleBack}
                variant="outline"
                className="mb-8 py-6 px-6 text-xl border-2 rounded-2xl"
              >
                <ArrowLeft className="w-6 h-6 mr-2" />
                Back to Home
              </Button>

              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Extended Practice</h1>
                <p className="text-xl text-gray-600">A longer session to challenge your memory</p>
              </div>

              <MemoryTraining onBack={handleBack} />
            </motion.div>
          ) : (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Ask Me Anything</h1>
                <p className="text-xl text-gray-600">I'll help you remember anything about your life</p>
              </div>

              <LifeAssistant onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}