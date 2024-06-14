import React, { createContext, useState } from 'react';

export const PointContext = createContext();

export const PointProvider = ({ children }) => {
  const [points, setPoints] = useState(0);

  const addPoint = () => {
    setPoints(prevPoints => prevPoints + 1);
  };

  return (
    <PointContext.Provider value={{ points, addPoint }}>
      {children}
    </PointContext.Provider>
  );
};
