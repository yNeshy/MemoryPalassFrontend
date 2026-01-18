// Mock API that simulates fetching personal data about the user
// In a real app, this would connect to an external service

const userData = {
  personal: {
    name: "Margaret",
    nickname: "Maggie",
    birthDate: "March 15, 1948",
    birthPlace: "Boston, Massachusetts",
    currentAge: 76,
    favoriteColor: "Blue",
    favoriteFood: "Apple pie",
    favoriteSong: "Moon River",
    pet: "A golden retriever named Sunny"
  },
  family: {
    spouse: {
      name: "Robert",
      nickname: "Bob",
      marriedSince: "June 1972",
      weddingLocation: "St. Mary's Church in Boston"
    },
    children: [
      { name: "Sarah", relation: "daughter", born: "1975", occupation: "Teacher", children: ["Emma", "Jack"] },
      { name: "Michael", relation: "son", born: "1978", occupation: "Engineer", children: ["Lily"] }
    ],
    grandchildren: ["Emma (age 12)", "Jack (age 9)", "Lily (age 7)"],
    siblings: [
      { name: "Dorothy", relation: "sister", note: "Lives in Florida" },
      { name: "James", relation: "brother", note: "Lives in California" }
    ]
  },
  home: {
    address: "42 Maple Street",
    city: "Cambridge",
    movedIn: "1980",
    description: "A white two-story house with a red door and a big oak tree in the front yard"
  },
  importantDates: [
    { date: "March 15", event: "Your birthday" },
    { date: "June 22", event: "Wedding anniversary with Bob" },
    { date: "December 3", event: "Sarah's birthday" },
    { date: "August 17", event: "Michael's birthday" }
  ],
  memories: [
    { title: "First dance", description: "You and Bob danced to 'Moon River' at your wedding" },
    { title: "Family vacation", description: "The whole family went to Cape Cod every summer" },
    { title: "Garden", description: "You love growing roses in your backyard garden" },
    { title: "Career", description: "You worked as a librarian for 30 years at Cambridge Public Library" }
  ],
  dailyRoutine: {
    morning: "Coffee with toast, reading the newspaper",
    medication: "Blood pressure medicine at 8am and 8pm",
    activities: "Walking in the park, reading, gardening"
  }
};

// Simulates an AI that can answer questions about the user
export async function queryUserData(question) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const q = question.toLowerCase();
  
  // Family questions
  if (q.includes("husband") || q.includes("spouse") || q.includes("married")) {
    return {
      answer: `Your husband's name is ${userData.family.spouse.name}, but you call him ${userData.family.spouse.nickname}. You got married in ${userData.family.spouse.marriedSince} at ${userData.family.spouse.weddingLocation}. You've been happily married for over 50 years!`,
      category: "family"
    };
  }
  
  if (q.includes("children") || q.includes("kids") || q.includes("son") || q.includes("daughter")) {
    return {
      answer: `You have two wonderful children: Sarah (your daughter, born in 1975) who is a teacher, and Michael (your son, born in 1978) who is an engineer. Sarah has two children, Emma and Jack. Michael has a daughter named Lily.`,
      category: "family"
    };
  }
  
  if (q.includes("grandchild") || q.includes("grandkid")) {
    return {
      answer: `You have three beautiful grandchildren: Emma (12 years old) and Jack (9 years old) - they are Sarah's children. And Lily (7 years old) is Michael's daughter. They all love visiting you!`,
      category: "family"
    };
  }
  
  if (q.includes("sister") || q.includes("brother") || q.includes("sibling")) {
    return {
      answer: `You have a sister named Dorothy who lives in Florida, and a brother named James who lives in California. You grew up together in Boston.`,
      category: "family"
    };
  }
  
  // Personal questions
  if (q.includes("name") || q.includes("who am i") || q.includes("my name")) {
    return {
      answer: `Your name is ${userData.personal.name}, but your loved ones call you ${userData.personal.nickname}. You were born on ${userData.personal.birthDate} in ${userData.personal.birthPlace}.`,
      category: "personal"
    };
  }
  
  if (q.includes("birthday") || q.includes("born") || q.includes("age")) {
    return {
      answer: `You were born on ${userData.personal.birthDate} in ${userData.personal.birthPlace}. You are ${userData.personal.currentAge} years old.`,
      category: "personal"
    };
  }
  
  if (q.includes("favorite color")) {
    return {
      answer: `Your favorite color is ${userData.personal.favoriteColor}. You've always loved wearing blue clothes!`,
      category: "personal"
    };
  }
  
  if (q.includes("favorite food") || q.includes("like to eat")) {
    return {
      answer: `Your favorite food is ${userData.personal.favoriteFood}. Your mother used to make it for you, and you continued the tradition.`,
      category: "personal"
    };
  }
  
  if (q.includes("pet") || q.includes("dog") || q.includes("cat")) {
    return {
      answer: `You have ${userData.personal.pet}. Sunny loves going on walks with you and playing in the backyard.`,
      category: "personal"
    };
  }
  
  if (q.includes("song") || q.includes("music")) {
    return {
      answer: `Your favorite song is "${userData.personal.favoriteSong}". It was the song you and Bob danced to at your wedding.`,
      category: "personal"
    };
  }
  
  // Home questions
  if (q.includes("address") || q.includes("live") || q.includes("home") || q.includes("house")) {
    return {
      answer: `You live at ${userData.home.address} in ${userData.home.city}. It's ${userData.home.description}. You've lived there since ${userData.home.movedIn}.`,
      category: "home"
    };
  }
  
  // Work questions
  if (q.includes("work") || q.includes("job") || q.includes("career")) {
    return {
      answer: `You worked as a librarian for 30 years at Cambridge Public Library. You loved helping people find books and organizing reading programs for children.`,
      category: "career"
    };
  }
  
  // Memory/hobby questions
  if (q.includes("garden") || q.includes("hobby") || q.includes("hobbies")) {
    return {
      answer: `You love gardening! You have a beautiful rose garden in your backyard. You also enjoy reading, walking in the park, and spending time with your grandchildren.`,
      category: "hobbies"
    };
  }
  
  if (q.includes("vacation") || q.includes("travel")) {
    return {
      answer: `Your family used to go to Cape Cod every summer! It's a wonderful beach destination. The whole family would swim, build sandcastles, and have clam chowder together.`,
      category: "memories"
    };
  }
  
  if (q.includes("wedding") || q.includes("married")) {
    return {
      answer: `You married Bob on June 22, 1972 at St. Mary's Church in Boston. Your first dance was to "Moon River." It was a beautiful sunny day!`,
      category: "memories"
    };
  }
  
  if (q.includes("medicine") || q.includes("medication")) {
    return {
      answer: `You take blood pressure medicine twice a day - at 8 in the morning and 8 in the evening. It's important to take it with water.`,
      category: "health"
    };
  }
  
  // Default response
  return {
    answer: `I'd be happy to help you remember! You are Margaret (Maggie), living at 42 Maple Street in Cambridge with your husband Bob. You have two children, Sarah and Michael, and three grandchildren. Is there something specific you'd like to know about?`,
    category: "general"
  };
}

// Get random questions for memory training
export function getMemoryQuestions() {
  return [
    {
      id: 1,
      question: "What is your husband's name?",
      answer: "Robert",
      alternativeAnswers: ["Robert", "Bob", "Bobby"],
      hint: "His nickname starts with 'B'",
      category: "Family",
      imageUrl: "https://images.unsplash.com/photo-1583585635793-0e1894c169bd?w=800&q=80"
    },
    {
      id: 2,
      question: "What is your daughter's name?",
      answer: "Sarah",
      alternativeAnswers: ["Sarah"],
      hint: "She is a teacher",
      category: "Family",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80"
    },
    {
      id: 3,
      question: "What is your son's name?",
      answer: "Michael",
      alternativeAnswers: ["Michael", "Mike"],
      hint: "He is an engineer",
      category: "Family",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    },
    {
      id: 4,
      question: "What is your favorite color?",
      answer: "Blue",
      alternativeAnswers: ["Blue"],
      hint: "It's the color of the sky",
      category: "Personal",
      imageUrl: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=800&q=80"
    },
    {
      id: 5,
      question: "What is your pet's name?",
      answer: "Sunny",
      alternativeAnswers: ["Sunny"],
      hint: "A golden retriever",
      category: "Personal",
      imageUrl: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&q=80"
    },
    {
      id: 6,
      question: "What street do you live on?",
      answer: "Maple Street",
      alternativeAnswers: ["Maple Street", "42 Maple Street", "Maple"],
      hint: "It's named after a type of tree",
      category: "Home",
      imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"
    },
    {
      id: 7,
      question: "Where did you get married?",
      answer: "St. Mary's Church",
      alternativeAnswers: ["St. Mary's Church", "St Mary's Church", "St. Mary's", "St Mary's", "Boston"],
      hint: "It's a church in Boston",
      category: "Memories",
      imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80"
    },
    {
      id: 8,
      question: "What is your favorite song?",
      answer: "Moon River",
      alternativeAnswers: ["Moon River"],
      hint: "You danced to it at your wedding",
      category: "Personal",
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80"
    },
    {
      id: 9,
      question: "How many grandchildren do you have?",
      answer: "3",
      alternativeAnswers: ["3", "Three", "three"],
      hint: "Emma, Jack, and Lily",
      category: "Family",
      imageUrl: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80"
    },
    {
      id: 10,
      question: "What job did you have?",
      answer: "Librarian",
      alternativeAnswers: ["Librarian", "librarian", "Library"],
      hint: "You worked with books",
      category: "Career",
      imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80"
    },
    {
      id: 11,
      question: "What is your sister's name?",
      answer: "Dorothy",
      alternativeAnswers: ["Dorothy", "Dot"],
      hint: "She lives in Florida",
      category: "Family",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80"
    },
    {
      id: 12,
      question: "What is your favorite food?",
      answer: "Apple pie",
      alternativeAnswers: ["Apple pie", "apple pie", "Pie"],
      hint: "A dessert made with fruit",
      category: "Personal",
      imageUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800&q=80"
    }
  ];
}

export { userData };