import { useState, useEffect } from "react";

export default function useLocalStorage(storageKey, initialValue) {
  const readValue = () => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const item = window.localStorage.getItem(storageKey);
    return item ? JSON.parse(item) : initialValue;
  };

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (storedValue) {
      window.localStorage.setItem(storageKey, JSON.stringify(storedValue));
    } else {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey, storedValue]);

  return [storedValue, setStoredValue];
}
