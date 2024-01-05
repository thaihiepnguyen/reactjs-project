'use client'
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutId); // Use clearTimeout to clear the timeout
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

