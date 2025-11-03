import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const ThemeProvider = ({ children }) => {
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  return <>{children}</>;
};

export default ThemeProvider;
