import React from "react";
import { motion } from "framer-motion";

export default function PalassCharacter({ size = 120, isThinking = false }) {
  return (
    <motion.div
      className="relative"
      animate={{
        scale: isThinking ? [1, 1.05, 1] : 1,
      }}
      transition={{
        scale: {
          duration: 0.8,
          repeat: isThinking ? Infinity : 0,
          ease: "easeInOut"
        }
      }}
    >
      {/* Main Body */}
      <motion.div
        className="relative mx-auto bg-white rounded-full shadow-lg"
        style={{ 
          width: size, 
          height: size,
        }}
        animate={{
          y: isThinking ? [0, -8, 0] : 0,
        }}
        transition={{
          y: {
            duration: 1.2,
            repeat: isThinking ? Infinity : 0,
            ease: "easeInOut"
          }
        }}
      >
        {/* Eyes */}
        <motion.div 
          className="absolute top-1/3 left-1/4 w-3 h-3 bg-gray-800 rounded-full"
          animate={isThinking ? {
            scaleY: [1, 0.1, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: isThinking ? Infinity : 0,
            repeatDelay: 1.5
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-800 rounded-full"
          animate={isThinking ? {
            scaleY: [1, 0.1, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: isThinking ? Infinity : 0,
            repeatDelay: 1.5
          }}
        />

        {/* Mouth - changes when thinking */}
        <motion.div 
          className="absolute bottom-1/3 left-1/2 -translate-x-1/2"
          animate={isThinking ? {
            width: ["20px", "12px", "20px"],
            height: ["8px", "8px", "8px"],
          } : {}}
          transition={{
            duration: 1,
            repeat: isThinking ? Infinity : 0,
          }}
        >
          <div className="w-5 h-2 border-2 border-gray-800 rounded-full border-t-0" />
        </motion.div>

        {/* Thinking dots */}
        {isThinking && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-xl"
          animate={{
            opacity: isThinking ? [0.3, 0.6, 0.3] : 0.2,
          }}
          transition={{
            duration: 2,
            repeat: isThinking ? Infinity : 0,
          }}
        />
      </motion.div>

      {/* Feet */}
      <div className="flex justify-center gap-4 mt-2">
        <motion.div
          className="w-8 h-8 bg-white rounded-full shadow-md"
          animate={isThinking ? {
            x: [0, -3, 0],
          } : {}}
          transition={{
            duration: 1.2,
            repeat: isThinking ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="w-8 h-8 bg-white rounded-full shadow-md"
          animate={isThinking ? {
            x: [0, 3, 0],
          } : {}}
          transition={{
            duration: 1.2,
            repeat: isThinking ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
}