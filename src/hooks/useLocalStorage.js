import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initialValue) {
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  };
  const [storedValue, setStoredValue] = useState(readValue);
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (storedValue) {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } else {
      window.localStorage.removeItem(key);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

