import React, { createContext, useContext, useState } from 'react';

const ScrollPositionContext = createContext();

export const ScrollPositionProvider = ({ children }) => {
  const [scrollPositions, setScrollPositions] = useState({});

  const saveScrollPosition = (path, position) => {
    setScrollPositions((prev) => ({
      ...prev,
      [path]: position,
    }));
  };

  const getScrollPosition = (path) => {
    return scrollPositions[path] || 0;
  };

  return (
    <ScrollPositionContext.Provider value={{ saveScrollPosition, getScrollPosition }}>
      {children}
    </ScrollPositionContext.Provider>
  );
};

export const useScrollPosition = () => {
  return useContext(ScrollPositionContext);
};
