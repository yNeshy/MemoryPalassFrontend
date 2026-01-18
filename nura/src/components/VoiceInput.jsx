import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function VoiceInput({ onTranscriptComplete, questionId }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const volumeIntervalRef = useRef(null);

  // Mock Speech-to-Text functionality
  const mockSTT = () => {
    const sampleTranscripts = [
      "Um, the room I'm in has, uh, white walls and, um, a large window on the left side. There's a, uh, comfortable sofa in the corner and, um, a wooden coffee table in the middle.",
      "I had, um, scrambled eggs and, uh, toast this morning with, um, orange juice. I think there was also, uh, some fruit, maybe a banana.",
      "Twenty, nineteen, eighteen, um, seventeen, sixteen, uh, fifteen, fourteen, thirteen, um, twelve, eleven, ten, nine, eight, uh, seven, six, five, four, three, two, one.",
      "The kitchen has, um, white cabinets and a, uh, stainless steel refrigerator. There's also, um, a microwave and, uh, a coffee maker on the counter."
    ];
    
    // Return a random sample or custom text
    const randomIndex = Math.floor(Math.random() * sampleTranscripts.length);
    return sampleTranscripts[randomIndex];
  };

  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');
    setRecordingTime(0);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Mock volume levels for visual feedback
    volumeIntervalRef.current = setInterval(() => {
      setVolumeLevel(Math.random() * 100);
    }, 100);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    clearInterval(volumeIntervalRef.current);
    setVolumeLevel(0);

    // Mock: Generate transcript
    const mockTranscript = mockSTT();
    setTranscript(mockTranscript);
  };

  const resetRecording = () => {
    setTranscript('');
    setRecordingTime(0);
  };

  const confirmTranscript = () => {
    onTranscriptComplete(transcript);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {!transcript ? (
        <>
          {/* Recording Interface */}
          <Card className="p-8 bg-white border-2 border-gray-200 rounded-3xl">
            <div className="text-center space-y-6">
              {/* Microphone Button */}
              <div className="flex justify-center">
                <motion.div
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-32 h-32 rounded-full text-white shadow-2xl ${
                      isRecording
                        ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-16 h-16" />
                    ) : (
                      <Mic className="w-16 h-16" />
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Status Text */}
              <div>
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  {isRecording ? 'Recording...' : 'Tap to Start Recording'}
                </p>
                {isRecording && (
                  <p className="text-xl text-gray-600">
                    Time: {formatTime(recordingTime)}
                  </p>
                )}
              </div>

              {/* Volume Indicator */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <p className="text-lg text-gray-600">Volume Level</p>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      animate={{ width: `${volumeLevel}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  
                  {/* Waveform visualization */}
                  <div className="flex justify-center items-center gap-1 h-16">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 bg-gradient-to-t from-blue-500 to-blue-600 rounded-full"
                        animate={{
                          height: `${Math.random() * 60 + 20}px`
                        }}
                        transition={{
                          duration: 0.15,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          delay: i * 0.05
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Instructions */}
              {!isRecording && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                  <p className="text-xl text-blue-800">
                    <strong>Tip:</strong> Speak naturally and take your time. The app will capture everything you say, including pauses.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* Transcript Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 bg-white border-2 border-green-200 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Recording Complete</h3>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
                <p className="text-lg text-gray-600 mb-2 font-medium">Your Response:</p>
                <p className="text-xl text-gray-800 leading-relaxed">{transcript}</p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={resetRecording}
                  variant="outline"
                  className="flex-1 py-6 text-xl border-2 rounded-2xl"
                >
                  <RotateCcw className="w-6 h-6 mr-2" />
                  Re-record
                </Button>
                <Button
                  onClick={confirmTranscript}
                  className="flex-1 py-6 text-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl"
                >
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  Confirm & Continue
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}