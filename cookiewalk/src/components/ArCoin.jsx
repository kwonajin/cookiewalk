import React, { useEffect } from 'react';
import 'aframe';
import 'ar.js/aframe/build/aframe-ar';

const ARCoin = ({ onClick }) => {
  useEffect(() => {
    const scene = document.querySelector('a-scene');
    const coin = document.createElement('a-cylinder');
    coin.setAttribute('position', '0 1.5 -5');
    coin.setAttribute('material', 'color: gold');
    coin.setAttribute('geometry', 'radius: 0.5; height: 0.1');
    coin.addEventListener('click', onClick);
    scene.appendChild(coin);

    return () => {
      scene.removeChild(coin);
    };
  }, [onClick]);

  return (
    <a-scene embedded arjs='sourceType: webcam;'>
      <a-marker preset="hiro">
        <a-box position="0 0.5 0" material="color: yellow"></a-box>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
};

export default ARCoin;
