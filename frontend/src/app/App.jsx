import React, { useState, useEffect } from 'react';
import Nav from '../features/shared/components/nav.jsx';
import Home from '../pages/home.jsx';

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('pipwise-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('pipwise-theme', theme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, [theme]);

  const [heroComplete, setHeroComplete] = useState(false);

  // Safety fallback timer to guarantee nav entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroComplete(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    try {
      document.documentElement.setAttribute('data-theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('pipwise-theme', nextTheme);
    } catch (e) {
      console.error('Failed to set theme immediately:', e);
    }
    setTheme(nextTheme);
  };

  return (
    <div className="pipwise-app">
      <Nav theme={theme} toggleTheme={toggleTheme} heroComplete={heroComplete} />
      <Home theme={theme} heroComplete={heroComplete} onTitleComplete={() => setHeroComplete(true)} />
    </div>
  );
}

export default App;
