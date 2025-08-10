import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

export default function FocusDetection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();
  const notFocusedRef = useRef(false);
  const lastNotificationRef = useRef(0);
  const noFaceStartTimeRef = useRef<number | null>(null);
  const lastPhoneDetectedRef = useRef(0);
  const [debugInfo, setDebugInfo] = useState("Initializing...");
  const cocoModelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const [phoneDetected, setPhoneDetected] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const annoyedFramesRef = useRef(0);
  const lastEmotionNotificationRef = useRef(0);
  const prevEyeRatioRef = useRef(0);
  const prevMouthRatioRef = useRef(0);
  const annoyedStartMsRef = useRef<number | null>(null);
  const [showStressNotif, setShowStressNotif] = useState(false);

  useEffect(() => {
    let destroyed = false;
    let stream: MediaStream | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let lastFrame: ImageData | null = null;
    let frameCount = 0;

    tf.ready().then(async () => {
      try {
        await tf.setBackend("webgl");
      } catch {}
    });

    cocoSsd.load({ base: "lite_mobilenet_v2" }).then((model) => {
      cocoModelRef.current = model;
      setDebugInfo((d) => d + " | COCO-SSD loaded");
    });

    setTimeout(() => {
      if (!destroyed) {
        toast({
          title: "Focus Detection Active",
          description:
            "Camera monitoring is now active. Look away for 3+ seconds to test.",
        });
        setDebugInfo("Toast test sent");
      }
    }, 2000);

    async function startCamera() {
      try {
        setDebugInfo("Starting camera...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 320,
            height: 240,
            facingMode: "user",
            frameRate: { ideal: 10, max: 15 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          canvas = document.createElement("canvas");
          canvas.width = 320;
          canvas.height = 240;
          ctx = canvas.getContext("2d");
          setDebugInfo("Camera active - monitoring");
          detectFace();
        }
      } catch (error: any) {
        setDebugInfo("Camera error: " + error?.message);
        setTimeout(() => {
          if (!destroyed) {
            toast({
              title: "Camera access required",
              description: "Please allow camera access for focus detection.",
            });
          }
        }, 5000);
      }
    }

    function detectFace() {
      if (destroyed || !videoRef.current || !ctx) return;
      try {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        const currentFrame = ctx.getImageData(0, 0, 320, 240);
        if (lastFrame) {
          let skinPixels = 0;
          const data = currentFrame.data;
          const width = 320;
          const height = 240;
          let eyeDarkCount = 0;
          let eyeTotalCount = 0;
          let mouthDarkCount = 0;
          let mouthTotalCount = 0;
          const eyeMaxY = Math.floor(height * 0.4);
          const mouthMinY = Math.floor(height * 0.65);
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const pixelIndex = i >> 2;
            const y = Math.floor(pixelIndex / width);
            if (
              r > 95 &&
              g > 40 &&
              b > 20 &&
              Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
              Math.abs(r - g) > 15 &&
              r > g &&
              r > b
            ) {
              skinPixels++;
            }
            const brightness = r + g + b;
            if (y < eyeMaxY) {
              eyeTotalCount++;
              if (brightness < 150) eyeDarkCount++;
            } else if (y >= mouthMinY) {
              mouthTotalCount++;
              if (brightness < 160) mouthDarkCount++;
            }
          }
          const totalPixels = data.length / 4;
          const skinPercentage = (skinPixels / totalPixels) * 100;
          const skinThreshold = 15;
          const isFace = skinPercentage > skinThreshold;
          setFaceDetected(isFace);

          if (isFace && eyeTotalCount > 0 && mouthTotalCount > 0) {
            const eyeDarkRatio = eyeDarkCount / eyeTotalCount;
            const mouthDarkRatio = mouthDarkCount / mouthTotalCount;
            const prevEye = prevEyeRatioRef.current;
            const prevMouth = prevMouthRatioRef.current;
            const eyeSpike = eyeDarkRatio - prevEye > 0.07;
            const mouthSpike = mouthDarkRatio - prevMouth > 0.06;
            prevEyeRatioRef.current = prevEye * 0.6 + eyeDarkRatio * 0.4;
            prevMouthRatioRef.current = prevMouth * 0.6 + mouthDarkRatio * 0.4;
            if (eyeDarkRatio > 0.25 || mouthDarkRatio > 0.20 || eyeSpike || mouthSpike) {
              if (annoyedStartMsRef.current === null) annoyedStartMsRef.current = Date.now();
              annoyedFramesRef.current += 1;
            } else {
              annoyedFramesRef.current = 0;
              annoyedStartMsRef.current = null;
            }
            const nowMs = Date.now();
            const annoyedDurationMs =
              annoyedStartMsRef.current !== null ? nowMs - annoyedStartMsRef.current : 0;
            if (annoyedDurationMs >= 1000 && annoyedFramesRef.current >= 8 && nowMs - lastEmotionNotificationRef.current > 30000) {
              lastEmotionNotificationRef.current = nowMs;
              setShowStressNotif(true);
              // Hide the image after 5 seconds
              setTimeout(() => {
                setShowStressNotif(false);
              }, 5000);
            }
          } else {
            annoyedFramesRef.current = 0;
            annoyedStartMsRef.current = null;
          }

          frameCount++;
          if (frameCount % 10 === 0) {
            setDebugInfo(`Phone: ${phoneDetected ? "Detected" : "Not Detected"} | Face: ${
              isFace ? "Detected" : "Not Detected"
            }`);
          }

          const now = Date.now();
          if (!isFace) {
            if (noFaceStartTimeRef.current === null) {
              noFaceStartTimeRef.current = now;
            }
            if (now - (noFaceStartTimeRef.current ?? 0) > 3000 && !notFocusedRef.current) {
              notFocusedRef.current = true;
              lastNotificationRef.current = now;
              setDebugInfo("Sending notification!");
              toast({
                title: "Hey, you are not focusing!",
                description: "Please pay attention to the course.",
              });
            }
          } else {
            noFaceStartTimeRef.current = null;
            notFocusedRef.current = false;
          }

          if (cocoModelRef.current && frameCount % 5 === 0) {
            cocoModelRef.current
              .detect(videoRef.current as HTMLVideoElement)
              .then((predictions) => {
                const phone = predictions.find((p) => p.class === "cell phone" && p.score > 0.3);
                const isPhoneDetectedNow = !!phone;
                setPhoneDetected(isPhoneDetectedNow);
                setDebugInfo(
                  `Phone: ${isPhoneDetectedNow ? "Detected" : "Not Detected"} | Face: ${
                    isFace ? "Detected" : "Not Detected"
                  }`
                );
                if (phone) {
                  const nowInner = Date.now();
                  if (nowInner - lastPhoneDetectedRef.current > 8000) {
                    lastPhoneDetectedRef.current = nowInner;
                    toast({
                      title: "PHONE DETECTED: Please pay attention",
                      description: "Please put your phone away and pay attention to the course.",
                      variant: "destructive",
                    });
                  }
                }
              })
              .catch(() => {});
          }
        }

        lastFrame = currentFrame;
        setTimeout(() => {
          if (!destroyed) detectFace();
        }, 100);
      } catch (error) {
        setDebugInfo("Face detection error");
      }
    }

    const focusInterval = setInterval(() => {
      if (!destroyed && notFocusedRef.current) {
        const now = Date.now();
        if (now - lastNotificationRef.current > 10000) {
          lastNotificationRef.current = now;
          setDebugInfo("Periodic notification sent");
          toast({ title: "Hey, you are not focusing!", description: "Please pay attention to the course." });
        }
      }
    }, 5000);

    startCamera();
    return () => {
      destroyed = true;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      clearInterval(focusInterval);
    };
  }, [toast, phoneDetected]);

  return (
    <>
      <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline muted />
      <div className="fixed top-6 right-6 bg-yellow-500 text-black px-5 py-3 rounded-xl text-base z-50 shadow-lg">
        {debugInfo}
      </div>
      {showStressNotif && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <img 
            src="/stressnotif.png" 
            alt="Stress notification" 
            className="max-w-md max-h-96 object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

