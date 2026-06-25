import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-wasm";
import faceapi from "@vladmandic/face-api/dist/face-api.node-wasm.js";
import * as canvas from "canvas";
import path from "path";
import { fileURLToPath } from "url";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;
const MODELS_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../face-models"
);

async function loadModels() {
  if (modelsLoaded) return;

  // WASM backend must be fully initialized before any TF operations
  await tf.setBackend("wasm");
  await tf.ready();

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
  modelsLoaded = true;
}

export async function compareFaces(selfieBuffer, documentBuffer) {
  await loadModels();

  const [selfieImg, docImg] = await Promise.all([
    canvas.loadImage(selfieBuffer),
    canvas.loadImage(documentBuffer),
  ]);

  const [selfieResult, docResult] = await Promise.all([
    faceapi.detectSingleFace(selfieImg).withFaceLandmarks().withFaceDescriptor(),
    faceapi.detectSingleFace(docImg).withFaceLandmarks().withFaceDescriptor(),
  ]);

  if (!selfieResult) throw new Error("No face detected in selfie");
  if (!docResult)    throw new Error("No face detected in document photo");

  const distance = faceapi.euclideanDistance(
    selfieResult.descriptor,
    docResult.descriptor
  );

  return {
    distance,
    matched: distance < 0.5,
    confidence: Math.round((1 - distance) * 100),
  };
}
