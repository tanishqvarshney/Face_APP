// src/components/Beautification.js
import React from 'react';
import FaceMeshComponent from './FaceMesh';
import ARComponent from './ARComponent';

const Beautification = ({ imageSrc }) => {
  return (
    <div>
      <h2>Beautification</h2>
      <FaceMeshComponent imageSrc={imageSrc} />
      <ARComponent />
    </div>
  );
};

export default Beautification;

