// src/App.js
import React, { useState } from 'react';
import FaceMeshComponent from './components/FaceMesh';
import ARComponent from './components/ARComponent';
import Beautification from './components/Beautification';
import BackgroundSubtraction from './components/BackgroundSubtraction';

function App() {
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="App">
      <h1>Face AR App</h1>
      <FaceMeshComponent />
      <ARComponent />
      <input type="file" onChange={handleImageUpload} />
      {imageSrc && <Beautification imageSrc={imageSrc} />}
      <BackgroundSubtraction />
    </div>
  );
}

export default App;

