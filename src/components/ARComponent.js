// src/components/ARComponent.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

const ARComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(640, 480);
    renderer.setClearColor(0x000000, 0);
    const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
    camera.position.set(0, 0, 2);
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

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

    const cameraVideo = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    cameraVideo.start();

    function onResults(results) {
      if (results.multiFaceLandmarks && modelRef.current) {
        const landmarks = results.multiFaceLandmarks[0];
        const positions = landmarks.map((lm) => new THREE.Vector3(lm.x * 2 - 1, -lm.y * 2 + 1, lm.z));
        // Update the model's position/rotation based on landmarks
        // For example, setting the position of glasses model
        const noseLandmark = landmarks[1]; // Nose tip
        modelRef.current.position.set(noseLandmark.x * 2 - 1, -noseLandmark.y * 2 + 1, noseLandmark.z);
      }
    }

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load('path/to/your/model.gltf', (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      modelRef.current = model;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
};

export default ARComponent;
