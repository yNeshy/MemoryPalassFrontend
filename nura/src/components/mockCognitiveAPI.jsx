// Mock API service for cognitive assessment

const mockQuestions = [
  { 
    id: "q1", 
    type: "text", 
    question: "What is today's full date? (Month, Day, Year)", 
    context: "orientation" 
  },
  { 
    id: "q2", 
    type: "text", 
    question: "What is your current address?", 
    context: "orientation" 
  },
  { 
    id: "q3", 
    type: "audio", 
    question: "Please describe the room you are currently in. Use at least 3 sentences.", 
    context: "semantic_memory" 
  },
  { 
    id: "q4", 
    type: "text", 
    question: "Can you name 3 objects in your kitchen?", 
    context: "semantic_memory" 
  },
  { 
    id: "q5", 
    type: "audio", 
    question: "Tell me about what you had for breakfast this morning.", 
    context: "episodic_memory" 
  },
  { 
    id: "q6", 
    type: "text", 
    question: "What are the names of your children?", 
    context: "episodic_memory" 
  },
  { 
    id: "q7", 
    type: "audio", 
    question: "Count backwards from 20 to 1 out loud.", 
    context: "attention_concentration" 
  },
  { 
    id: "q8", 
    type: "text", 
    question: "What season is it right now?", 
    context: "orientation" 
  }
];

export const fetchCognitiveTest = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockQuestions;
};

export const submitCognitiveTest = async (answers) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock evaluation logic
  const totalQuestions = mockQuestions.length;
  let score = 0;
  
  // Simple mock scoring based on whether answers were provided
  answers.forEach(answer => {
    if (answer.answer && answer.answer.trim().length > 0) {
      // Give more points for longer, detailed answers
      const answerLength = answer.answer.trim().length;
      if (answerLength > 50) {
        score += 15;
      } else if (answerLength > 20) {
        score += 12;
      } else if (answerLength > 5) {
        score += 10;
      } else {
        score += 5;
      }
    }
  });
  
  // Normalize to 0-100 scale
  const normalizedScore = Math.min(100, Math.round((score / (totalQuestions * 15)) * 100));
  
  let summary = "";
  let recommendation = "";
  
  if (normalizedScore >= 85) {
    summary = "Excellent cognitive performance! Your responses show strong orientation, memory, and attention.";
    recommendation = "Continue with your daily cognitive exercises and maintain your healthy lifestyle.";
  } else if (normalizedScore >= 70) {
    summary = "Good cognitive performance. Your responses indicate normal cognitive function with minor variations.";
    recommendation = "Keep up with regular mental activities and consider daily memory exercises.";
  } else if (normalizedScore >= 50) {
    summary = "Moderate cognitive performance. Some responses suggest areas that may benefit from attention.";
    recommendation = "Consider consulting with your healthcare provider and increase cognitive stimulation activities.";
  } else {
    summary = "Your responses suggest potential cognitive concerns that warrant professional evaluation.";
    recommendation = "We recommend scheduling an appointment with a healthcare professional for a comprehensive assessment.";
  }
  
  return {
    score: normalizedScore,
    summary,
    recommendation,
    detailed_analysis: {
      orientation: normalizedScore >= 70 ? "Good" : "Needs attention",
      memory: normalizedScore >= 60 ? "Normal" : "Requires follow-up",
      attention: normalizedScore >= 65 ? "Adequate" : "May need support"
    }
  };
};