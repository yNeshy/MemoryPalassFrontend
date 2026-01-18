import React, { createContext, useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, Clock, Settings } from "lucide-react";
import { motion } from "framer-motion";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const createPageUrl = (pageName) => {
  const pageMap = {
    'home': '/',
    'memory': '/memory',
    'settings': '/settings'
  };
  return pageMap[pageName] || '/';
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const navigationItems = [
    {
      title: "Palass",
      url: createPageUrl("home"),
      icon: Brain,
    },
    {
      title: "Memory",
      url: createPageUrl("memory"),
      icon: Clock,
    },
    {
      title: "Settings",
      url: createPageUrl("settings"),
      icon: Settings,
    },
  ];

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-colors duration-300">
          <main className="pb-20">
            {children}
          </main>

          <motion.nav 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 shadow-lg z-50"
          >
            <div className="max-w-md mx-auto px-4">
              <div className="flex justify-around items-center h-16">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      className="flex flex-col items-center justify-center flex-1 relative"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                      >
                        <item.icon 
                          className={`w-6 h-6 transition-colors ${
                            isActive 
                              ? 'text-purple-600 dark:text-purple-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                        />
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full"
                          />
                        )}
                      </motion.div>
                      <span 
                        className={`text-xs mt-1 font-medium transition-colors ${
                          isActive 
                            ? 'text-purple-600 dark:text-purple-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}