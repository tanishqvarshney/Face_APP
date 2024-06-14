// src/components/FaceMesh.js
import React, { useRef, useEffect } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';
import * as faceLandmarks from '@mediapipe/face_mesh/face_mesh';

const FaceMeshComponent = ({ imageSrc }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    function onResults(results) {
      const canvasCtx = canvasRef.current.getContext('2d');
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawConnectors(canvasCtx, landmarks, faceLandmarks.FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
          drawConnectors(canvasCtx, landmarks, faceLandmarks.FACEMESH_RIGHT_EYE, { color: '#FF3030' });
          drawConnectors(canvasCtx, landmarks, faceLandmarks.FACEMESH_RIGHT_EYEBROW, { color: '#FF3030' });
          drawConnectors(canvasCtx, landmarks, faceLandmarks.FACEMESH_LEFT_EYE, { color: '#30FF30' });
          drawConnectors(canvasCtx, landmarks, faceLandmarks.FACEMESH_LEFT_EYEBROW, { color: '#30FF30' });
          drawConnectors(canvasCtx, landmarks, faceLandmarks.FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
          drawConnectors(canvasCtx, landmarks, faceLandmarks.FACEMESH_LIPS, { color: '#E0E0E0' });
        }
      }
    }
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
};

export default FaceMeshComponent;

