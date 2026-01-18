import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { queryUserData } from './mockUserDataAPI';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  Bot, 
  Loader2,
  Home,
  Heart,
  MapPin,
  Briefcase,
  HelpCircle
} from 'lucide-react';

const suggestedQuestions = [
  { icon: Heart, text: "Who is my husband?", color: "bg-pink-100 text-pink-700 border-pink-200" },
  { icon: User, text: "Tell me about my children", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { icon: MapPin, text: "Where do I live?", color: "bg-green-100 text-green-700 border-green-200" },
  { icon: Briefcase, text: "What job did I have?", color: "bg-purple-100 text-purple-700 border-purple-200" },
];

export default function LifeAssistant({ onBack }) {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: "Hello! I'm here to help you remember. Ask me anything about your life, family, or memories. I'm here to help!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (question = inputValue) => {
    if (!question.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      text: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await queryUserData(question);
      
      const assistantMessage = {
        type: 'assistant',
        text: response.answer,
        category: response.category,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: "I'm sorry, I couldn't find that information right now. Please try asking in a different way.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="py-6 px-6 text-xl border-2 rounded-2xl"
        >
          <Home className="w-6 h-6 mr-2" />
          Home
        </Button>
        <div className="flex items-center gap-3 bg-green-100 px-6 py-3 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-lg text-green-700 font-medium">Ready to help</span>
        </div>
      </div>

      {/* Chat area */}
      <Card className="bg-white border-0 shadow-xl rounded-3xl overflow-hidden">
        {/* Messages */}
        <div className="h-[450px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                }`}>
                  {message.type === 'user' 
                    ? <User className="w-7 h-7 text-white" />
                    : <Bot className="w-7 h-7 text-white" />
                  }
                </div>
                
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-5 rounded-2xl max-w-[85%] ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white text-left'
                      : 'bg-white border-2 border-gray-100 text-gray-800 shadow-sm'
                  }`}>
                    <p className="text-xl leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                  <span className="text-xl text-gray-600">Looking up your information...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 2 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-lg text-gray-500 mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Try asking:
            </p>
            <div className="flex flex-wrap gap-3">
              {suggestedQuestions.map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSend(q.text)}
                  className={`py-4 px-5 text-lg rounded-xl border-2 ${q.color} hover:scale-105 transition-transform`}
                  disabled={isLoading}
                >
                  <q.icon className="w-5 h-5 mr-2" />
                  {q.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex gap-4">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your life..."
              className="flex-1 text-xl py-7 px-6 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="px-8 py-7 text-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl shadow-lg"
            >
              <Send className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}