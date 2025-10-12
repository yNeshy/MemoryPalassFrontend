export const base44 = {
  entities: {
    Fact: {
      list: async () => [
        { id: 1, content: "The Eiffel Tower can be 15 cm taller during the summer." },
        { id: 2, content: "Bananas are berries, but strawberries aren't." },
        { id: 3, content: "Honey never spoils." },
        { id: 4, content: "Octopuses have three hearts." },
        { id: 5, content: "A group of flamingos is called a 'flamboyance'." },
        { id: 6, content: "There are more stars in the universe than grains of sand on Earth." },
        { id: 7, content: "Wombat poop is cube-shaped." },
        { id: 8, content: "Humans share about 60% of their DNA with bananas." },
        { id: 9, content: "The shortest war in history lasted 38 minutes." },
        { id: 10, content: "A day on Venus is longer than a year on Venus." },
      ],
      create: async (data) => ({ id: Date.now(), ...data }),
    }
  }
};