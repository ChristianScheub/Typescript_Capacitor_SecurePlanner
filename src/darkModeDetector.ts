import { useState, useEffect } from 'react';

function useDarkMode() {
  const [theme, setTheme] = useState<'lightMode' | 'darkMode'>('lightMode');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setTheme(event.matches ? 'darkMode' : 'lightMode');

    mediaQuery.addEventListener('change', handleChange);
    
    setTheme(mediaQuery.matches ? 'darkMode' : 'lightMode');

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return theme;
}

export default useDarkMode;