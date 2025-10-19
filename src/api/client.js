// NOTE: Do NOT call React hooks (like useAuth) at module scope. Components should
// obtain tokens via hooks and pass them to these functions when needed.

const entities = {
  Fact: {
    list: async () => {
      // Generate mock facts with random created_date values in 2025
      const contents = [
        "The Eiffel Tower can be 15 cm taller during the summer.",
        "Bananas are berries, but strawberries aren't.",
        "Honey never spoils.",
        "Octopuses have three hearts.",
        "A group of flamingos is called a 'flamboyance'.",
        "There are more stars in the universe than grains of sand on Earth.",
        "Wombat poop is cube-shaped.",
        "Humans share about 60% of their DNA with bananas.",
        "The shortest war in history lasted 38 minutes.",
        "A day on Venus is longer than a year on Venus.",
      ];

      const start = new Date('2025-01-01T00:00:00Z').getTime();
      const end = new Date('2025-12-31T23:59:59Z').getTime();
      const randomDateISO = () => new Date(start + Math.floor(Math.random() * (end - start))).toISOString();

      return contents.map((content, i) => ({
        id: i + 1,
        content,
        created_date: randomDateISO(),
      }));
    },
    create: async (data) => ({ id: Date.now(), ...data, created_date: new Date().toISOString() }),
    delete: async (id) => {
      // Mock deletion — in real app you'd call an API
      console.log(`Mock delete fact ${id}`);
      return { success: true };
    }
  }
};

const BASE_URL = 'http://localhost:8000/api';

const api = {
    // ask(question, token?) - token should be passed from a component that has access to Clerk's useAuth
    ask: async (question, token = null) => {
      const url = BASE_URL + '/memory?' + new URLSearchParams({ question }).toString();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(url, { headers, method: 'GET' });

      if (!response.ok) {
        throw new Error(`Failed to get answer: ${response.status}`);
      }

      const data = await response.json();
      return data.answer;
    },

    // store(fact, token?) - token should be passed from the caller
    store: async (fact, token = null) => {
      const url = BASE_URL + '/memory';
      const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, {
        headers,
        method: 'POST',
        body: JSON.stringify({ text: fact }),
      });

      if (!response.ok) {
        throw new Error(`Failed to store fact: ${response.status}`);
      }

      return await response.json();
    },
}

const auth = {
  // Simulate fetching current user
  me: async () => {
    const url = BASE_URL + '/me';
      const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, {
        headers,
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      data = await response.json();
      return {
        'email': data.email,
        'is_admin': data.is_admin,
        'name': data.first_name + ' ' + data.last_name
      }
  }
};

export const palassapi = {
  auth,
  entities,
  api,
};
