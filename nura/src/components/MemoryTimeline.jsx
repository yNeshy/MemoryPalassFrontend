import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  Heart,
  Calendar,
  MapPin,
  Users,
  Briefcase,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const timelineData = [
  {
    year: "1948",
    title: "You Were Born",
    description: "Born on March 15, 1948, in Boston, Massachusetts. Your parents were overjoyed!",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&q=80",
    color: "from-pink-400 to-rose-500"
  },
  {
    year: "1972",
    title: "Wedding Day",
    description: "You married Robert (Bob) on June 22, 1972, at St. Mary's Church in Boston. Your first dance was to 'Moon River.'",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    color: "from-red-400 to-pink-500"
  },
  {
    year: "1975",
    title: "Sarah Was Born",
    description: "Your daughter Sarah was born! She brought so much joy to your life and later became a wonderful teacher.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
    color: "from-purple-400 to-pink-500"
  },
  {
    year: "1978",
    title: "Michael Was Born",
    description: "Your son Michael was born! He grew up to be an engineer and made you so proud.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    color: "from-blue-400 to-purple-500"
  },
  {
    year: "1980",
    title: "Moved to Cambridge",
    description: "You and Bob moved into your beautiful white house at 42 Maple Street with the big oak tree in the front yard.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    color: "from-green-400 to-emerald-500"
  },
  {
    year: "1980s-2000s",
    title: "Librarian Career",
    description: "You worked as a librarian at Cambridge Public Library for 30 wonderful years, helping people find books and organizing reading programs.",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
    color: "from-indigo-400 to-blue-500"
  },
  {
    year: "1990s-2000s",
    title: "Cape Cod Summers",
    description: "Your family vacations to Cape Cod every summer! Swimming, sandcastles, and clam chowder with the whole family.",
    icon: MapPin,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    color: "from-cyan-400 to-blue-500"
  },
  {
    year: "2010s",
    title: "Grandchildren",
    description: "Emma, Jack, and Lily were born! Being a grandmother has been one of your greatest joys.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80",
    color: "from-yellow-400 to-orange-500"
  },
  {
    year: "Present",
    title: "Your Garden",
    description: "You love spending time in your beautiful rose garden with your golden retriever Sunny by your side.",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
    color: "from-emerald-400 to-green-500"
  }
];

export default function MemoryTimeline({ onBack }) {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < timelineData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedMemory(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedMemory(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <Button
        onClick={onBack}
        variant="outline"
        className="mb-8 py-6 px-6 text-xl border-2 rounded-2xl"
      >
        <Home className="w-6 h-6 mr-2" />
        Back to Home
      </Button>

      {/* Timeline Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className="py-6 px-8 text-xl border-2 rounded-2xl disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6 mr-2" />
            Earlier
          </Button>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{timelineData[currentIndex].year}</div>
            <div className="text-lg text-gray-600">{currentIndex + 1} of {timelineData.length}</div>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={currentIndex === timelineData.length - 1}
            variant="outline"
            className="py-6 px-8 text-xl border-2 rounded-2xl disabled:opacity-50"
          >
            Later
            <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / timelineData.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Memory Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl bg-white">
            {/* Image */}
            <div className="relative h-96 overflow-hidden">
              <motion.img
                src={timelineData[currentIndex].image}
                alt={timelineData[currentIndex].title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Year badge */}
              <div className="absolute top-6 left-6">
                <div className={`px-6 py-3 bg-gradient-to-r ${timelineData[currentIndex].color} rounded-2xl shadow-lg`}>
                  <span className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    {timelineData[currentIndex].year}
                  </span>
                </div>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-16 h-16 bg-gradient-to-br ${timelineData[currentIndex].color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    {React.createElement(timelineData[currentIndex].icon, {
                      className: "w-8 h-8 text-white"
                    })}
                  </div>
                  <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                    {timelineData[currentIndex].title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-8">
              <p className="text-2xl text-gray-700 leading-relaxed">
                {timelineData[currentIndex].description}
              </p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Timeline dots navigation */}
      <div className="mt-8 flex justify-center gap-3 flex-wrap">
        {timelineData.map((memory, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all ${
              index === currentIndex
                ? 'w-12 h-4 bg-gradient-to-r from-amber-500 to-orange-600'
                : 'w-4 h-4 bg-gray-300 hover:bg-gray-400'
            } rounded-full`}
            aria-label={`Go to ${memory.year}`}
          />
        ))}
      </div>

      {/* Quick jump */}
      <div className="mt-8 grid grid-cols-3 md:grid-cols-5 gap-3">
        {timelineData.map((memory, index) => (
          <Button
            key={index}
            onClick={() => setCurrentIndex(index)}
            variant={index === currentIndex ? "default" : "outline"}
            className={`py-4 text-lg rounded-xl ${
              index === currentIndex
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                : 'border-2'
            }`}
          >
            {memory.year}
          </Button>
        ))}
      </div>
    </div>
  );
}