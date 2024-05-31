import React, { useState, useEffect } from 'react';

const LocationTracker = ({ onReward }) => {
  const [distance, setDistance] = useState(0);
  const [lastPosition, setLastPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (lastPosition) {
            const newDistance = calculateDistance(lastPosition, { latitude, longitude });
            setDistance(prevDistance => {
              const totalDistance = prevDistance + newDistance;
              if (Math.floor(totalDistance) > Math.floor(prevDistance)) {
                onReward(); // 1m마다 리워드 주기
              }
              return totalDistance;
            });
          }
          setLastPosition({ latitude, longitude });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true, distanceFilter: 1 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [lastPosition, onReward]);

  return (
    <div>
      <p>Distance: {distance.toFixed(2)} meters</p>
    </div>
  );
};

const calculateDistance = (pos1, pos2) => {
  const R = 6371e3; // meters
  const φ1 = pos1.latitude * Math.PI / 180;
  const φ2 = pos2.latitude * Math.PI / 180;
  const Δφ = (pos2.latitude - pos1.latitude) * Math.PI / 180;
  const Δλ = (pos2.longitude - pos1.longitude) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default LocationTracker;
