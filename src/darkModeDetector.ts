import { useState, useEffect } from 'react';

function useDarkMode() {
  const [theme, setTheme] = useState<'lightMode' | 'darkMode'>('lightMode');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setTheme(mediaQuery.matches ? 'darkMode' : 'lightMode');
    handleChange();
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return theme;
}

export default useDarkMode;