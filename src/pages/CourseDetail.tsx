
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef, useMemo } from "react";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import CourseChatbot from "@/components/CourseChatbot";

// Sample course data
const courses = [
  {
    id: "1",
    title: "Blockchain Fundamentals",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: Introduction to Blockchain Technology",
        videoUrl: "/video/chapitre1b.mp4",
        quizUrl: "https://example.com/quiz-bc-chapter-1",
        quiz: [
          {
            question: "Blockchain is always controlled by a single central authority.",
            choices: ["True", "False"],
            correct: 1,
          },
          {
            question: "Which of the following is NOT a property of blockchain?",
            choices: ["Decentralization", "Immutability", "Transparency", "Centralized governance"],
            correct: 3,
          },
          {
            question:
              "If someone changes one block, can they change history?",
            choices: [
              "Yes, miners can easily edit history",
              "They only need to change that single block",
              "They would need to alter subsequent blocks and control majority consensus",
              "Nodes will accept any change without checks",
            ],
            correct: 2,
          },
        ],
      },
      {
        id: "2",
        title: "Chapter 2: Distributed Ledger Technology (DLT)",
        videoUrl: "/video/chapitre2b.mp4",
        quizUrl: "https://example.com/quiz-bc-chapter-2",
        quiz: [
          {
            question: "A distributed ledger always requires internet access for all participants to function.",
            choices: ["True", "False"],
            correct: 1,
          },
          {
            question: "Which statement about permissioned vs. permissionless ledgers is correct?",
            choices: [
              "Permissionless ledgers require approval to join",
              "Permissioned ledgers allow anyone to participate without approval",
              "Permissionless are open to all; permissioned restrict access",
              "Both require government approval",
            ],
            correct: 2,
          },
          {
            question:
              "A bank considers a ledger for interbank settlements. Which type should it use?",
            choices: [
              "Permissionless ledger for maximum openness",
              "Permissioned ledger for controlled participation and compliance",
              "Either; there is no difference",
              "Paper ledgers are better",
            ],
            correct: 1,
          },
        ],
      },
      {
        id: "3",
        title: "Chapter 3: Cryptography in Blockchain",
        videoUrl: "/video/chapitre3b.mp4",
        quizUrl: "https://example.com/quiz-bc-chapter-3",
        quiz: [
          {
            question: "A hash function in blockchain can be reversed to retrieve the original data.",
            choices: ["True", "False"],
            correct: 1,
          },
          {
            question: "What is the primary function of a public key?",
            choices: [
              "Store cryptocurrency securely offline",
              "Identify the sender in a transaction",
              "Receive funds on the blockchain",
              "Encrypt the blockchain’s code",
            ],
            correct: 2,
          },
          {
            question:
              "How could you verify a file hasn’t been tampered with using hashing?",
            choices: [
              "Open it in a text editor",
              "Generate its hash and compare to the original recorded hash",
              "Compress the file and re-upload",
              "Rename the file",
            ],
            correct: 1,
          },
        ],
      },
      {
        id: "4",
        title: "Chapter 4: Smart Contracts and Decentralized Identity",
        videoUrl: "/video/chapitre4b.mp4",
        quizUrl: "https://example.com/quiz-bc-chapter-4",
        quiz: [
          {
            question: "Smart contracts require human intervention to execute terms.",
            choices: ["True", "False"],
            correct: 1,
          },
          {
            question: "Which platform is most commonly associated with smart contracts?",
            choices: ["Bitcoin", "Ethereum", "Ripple", "Hyperledger Sawtooth"],
            correct: 1,
          },
          {
            question:
              "A university wants verifiable online diplomas. Which feature is most useful?",
            choices: [
              "Centralized database backups",
              "Smart contracts and decentralized identity",
              "Higher block size",
              "More mining pools",
            ],
            correct: 1,
          },
        ],
      },
      {
        id: "5",
        title: "Chapter 5: Privacy, Logic, and Computational Models",
        videoUrl: "/video/chapitre5b.mp4",
        quizUrl: "https://example.com/quiz-bc-chapter-5",
        quiz: [
          {
            question:
              "Zero-knowledge proofs allow proving knowledge without revealing the information itself.",
            choices: ["True", "False"],
            correct: 0,
          },
          {
            question: "Which is an off-chain computation example?",
            choices: [
              "Mining a Bitcoin block",
              "Verifying a smart contract on Ethereum",
              "Running heavy computations off-chain then recording results on-chain",
              "Hashing transactions on the blockchain",
            ],
            correct: 2,
          },
          {
            question:
              "A healthcare DApp must prove criteria without revealing details. Which method?",
            choices: [
              "Zero-knowledge proofs",
              "Plaintext storage",
              "Manual verification by email",
              "Public forum disclosure",
            ],
            correct: 0,
          },
        ],
      },
      {
        id: "6",
        title: "Chapter 6: Cryptocurrency Fundamentals",
        videoUrl: "/video/chapitre6b.mp4",
        quizUrl: "https://example.com/quiz-bc-chapter-6",
        quiz: [
          {
            question: "All cryptocurrencies are built on the Bitcoin blockchain.",
            choices: ["True", "False"],
            correct: 1,
          },
          {
            question: "Which factor can influence cryptocurrency value?",
            choices: ["Supply and demand", "Network adoption", "Regulatory news", "All of the above"],
            correct: 3,
          },
          {
            question:
              "Best long-term Bitcoin storage with maximum security?",
            choices: [
              "Hot wallet on phone",
              "Exchange account",
              "Cold wallet (hardware/paper) offline",
              "Email the seed phrase to yourself",
            ],
            correct: 2,
          },
        ],
      },
      {
        id: "7",
        title: "Chapter 7: Consensus Mechanisms",
        videoUrl: "/video/chapitre7b.mp4",
        quizUrl: "https://example.com/quiz-bc-chapter-7",
        quiz: [
          {
            question: "Proof of Stake selects validators based solely on computational power.",
            choices: ["True", "False"],
            correct: 1,
          },
          {
            question: "Which consensus mechanism burns coins to participate in validation?",
            choices: ["Proof of Work", "Proof of Stake", "Proof of Burn", "Proof of Elapsed Time"],
            correct: 2,
          },
          {
            question:
              "A green-energy-focused blockchain wants lower power use and decentralization. Choose:",
            choices: ["Proof of Work", "Proof of Stake", "Proof of Burn", "Proof of Authority"],
            correct: 1,
          },
        ],
      },
      {
        id: "8",
        title: "Chapter 8: Blockchain Ecosystem and Emerging Applications",
        videoUrl: "/video/chapitre8b.mp4",
        quizUrl: "https://example.com/quiz-bc-chapter-8",
        quiz: [
          {
            question: "All tokens are independent cryptocurrencies with their own blockchains.",
            choices: ["True", "False"],
            correct: 1,
          },
          {
            question: "Which of the following is an ERC-20 token example?",
            choices: ["Bitcoin", "Ethereum", "Tether (USDT)", "Dogecoin"],
            correct: 2,
          },
          {
            question:
              "A startup wants to raise funds via blockchain without giving equity. Choose:",
            choices: ["ICO", "IPO", "Bank loan", "Crowdfunding with shares"],
            correct: 0,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Crypto Investing 101",
    chapters: [
      { 
        id: "0", 
        title: "Chapter 0: Introduction", 
        videoUrl: "/video/Chapter 0 - Course Introduction (online-video-cutter.com).mp4", 
        quizUrl: "https://example.com/quiz-chapter-0",
        quiz: [
          {
            question: "What is crypto investing?",
            choices: [
              "Buying stocks in tech companies",
              "Buying digital currencies hoping their value increases",
              "Collecting physical coins",
              "Gambling online"
            ],
            correct: 1
          },
          {
            question: "True or False: This course gives you specific financial advice on what crypto to buy.",
            choices: [
              "True",
              "False"
            ],
            correct: 1
          },
          {
            question: "What should you do before making any crypto investment?",
            choices: [
              "Follow the instructor’s tips without question",
              "Do your own research",
              "Ask a friend",
              "Invest all your savings"
            ],
            correct: 1
          }
        ]
      },
      { 
        id: "1", 
        title: "Chapter 1: Crypto Basics", 
        videoUrl: "/video/Chapter 1.mp4", 
        quizUrl: "https://example.com/quiz-chapter-1",
        quiz: [
          {
            question: "What is cryptocurrency?",
            choices: [
              "Physical coins you collect",
              "Digital money secured by cryptography",
              "A type of bank account",
              "A video game currency"
            ],
            correct: 1
          },
          {
            question: "What’s a blockchain like?",
            choices: [
              "A private diary",
              "A public notebook that can’t be changed",
              "A wallet for crypto",
              "A bank vault"
            ],
            correct: 1
          },
          {
            question: "True or False: Tokens have their own blockchains.",
            choices: [
              "True",
              "False"
            ],
            correct: 1
          }
        ]
      },
      { 
        id: "2", 
        title: "Chapter 2: Wallets", 
        videoUrl: "/video/Chapter 2.mp4", 
        quizUrl: "https://example.com/quiz-chapter-2",
        quiz: [
          {
            question: "What does a crypto wallet store?",
            choices: [
              "Your crypto coins",
              "Your private keys",
              "Your bank details",
              "Your passwords"
            ],
            correct: 1
          },
          {
            question: "Which is more secure?",
            choices: [
              "Hot wallet",
              "Cold wallet",
              "Both are the same",
              "Neither"
            ],
            correct: 1
          },
          {
            question: "What’s a seed phrase?",
            choices: [
              "A type of crypto",
              "A backup to recover your wallet",
              "A password for exchanges",
              "A security question"
            ],
            correct: 1
          },
          {
            question: "True or False: It’s fine to use public Wi-Fi for your wallet.",
            choices: [
              "True",
              "False"
            ],
            correct: 1
          }
        ]
      },
      { 
        id: "3", 
        title: "Chapter 3: Exchanges", 
        videoUrl: "/video/Chapter3.mp4", 
        quizUrl: "https://example.com/quiz-chapter-2",
        quiz: [
          {
            question: "What’s a CEX?",
            choices: [
              "A decentralized exchange",
              "A centralized exchange run by a company",
              "A type of wallet",
              "A crypto coin"
            ],
            correct: 1
          },
          {
            question: "What’s KYC?",
            choices: [
              "A way to secure your wallet",
              "A verification process with your ID",
              "A type of order",
              "A scam to avoid"
            ],
            correct: 1
          },
          {
            question: "True or False: It’s smart to leave your crypto on an exchange forever.",
            choices: [
              "True",
              "False"
            ],
            correct: 1
          },
          {
            question: "What’s a good first step on an exchange?",
            choices: [
              "Turn on 2FA",
              "Share your password",
              "Skip KYC",
              "Invest everything"
            ],
            correct: 0
          }
        ]
      },
      { 
        id: "4", 
        title: "Chapter 4: Buying Crypto", 
        videoUrl: "/video/Chapitre4.mp4", 
        quizUrl: "https://example.com/quiz-chapter-2",
        quiz: [
          {
            question: "What’s the first step to buy crypto?",
            choices: [
              "Place an order",
              "Complete KYC",
              "Pick a wallet",
              "Send crypto"
            ],
            correct: 1
          },
          {
            question: "What’s a market order?",
            choices: [
              "Buying at a set price later",
              "Buying at the current price now",
              "Selling crypto",
              "Transferring funds"
            ],
            correct: 1
          },
          {
            question: "Why move crypto to your wallet?",
            choices: [
              "It’s faster",
              "It’s safer",
              "It’s required",
              "It earns money"
            ],
            correct: 1
          },
          {
            question: "True or False: You can recover crypto sent to the wrong address.",
            choices: [
              "True",
              "False"
            ],
            correct: 1
          }
        ]
      },
      { 
        id: "5", 
        title: "Chapter 5: Portfolio and Risk Management", 
        videoUrl: "/video/chapitre 5.mp4", 
        quizUrl: "https://example.com/quiz-chapter-2",
        quiz: [
          {
            question: "What’s diversification?",
            choices: [
              "Investing in one crypto",
              "Spreading money across different cryptos",
              "Selling everything",
              "Borrowing to invest"
            ],
            correct: 1
          },
          {
            question: "What’s dollar-cost averaging?",
            choices: [
              "Investing all at once",
              "Buying small amounts regularly",
              "Selling when prices drop",
              "Trading daily"
            ],
            correct: 1
          },
          {
            question: "What’s a stop-loss order?",
            choices: [
              "A way to buy cheaper",
              "An auto-sell if prices fall",
              "A profit-taking tool",
              "A wallet feature"
            ],
            correct: 1
          },
          {
            question: "True or False: Invest money you need for bills.",
            choices: [
              "True",
              "False"
            ],
            correct: 1
          }
        ]
      },
      { 
        id: "6", 
        title: "Chapter 6: Avoiding Scams", 
        videoUrl: "/video/chapitre6.mp4", 
        quizUrl: "https://example.com/quiz-chapter-2",
        quiz: [
          {
            question: "What’s phishing?",
            choices: [
              "A trading strategy",
              "A scam to steal your info",
              "A wallet type",
              "A coin launch"
            ],
            correct: 1
          },
          {
            question: "What’s a red flag for scams?",
            choices: [
              "Clear team info",
              '“Guaranteed” profits',
              "Good reviews",
              "Slow decisions"
            ],
            correct: 1
          },
          {
            question: "True or False: Share your private keys with support teams.",
            choices: [
              "True",
              "False"
            ],
            correct: 1
          },
          {
            question: "How do you avoid scams?",
            choices: [
              "Act fast on offers",
              "Check details and use trusted platforms",
              "Trust every ad",
              "Send crypto to strangers"
            ],
            correct: 1
          }
        ]
      },
      { 
        id: "7", 
        title: "Chapter 7: Strategies", 
        videoUrl: "/video/chapitre7.mp4", 
        quizUrl: "https://example.com/quiz-chapter-2",
        quiz: [
          {
            question: "What’s HODL?",
            choices: [
              "Buy and sell daily",
              "Hold On for Dear Life",
              "A scam tactic",
              "A wallet type"
            ],
            correct: 1
          },
          {
            question: "What’s DCA good for?",
            choices: [
              "Fast profits",
              "Smoothing price swings",
              "High risk",
              "Expert traders"
            ],
            correct: 1
          },
          {
            question: "Which is short-term?",
            choices: [
              "HODL",
              "DCA",
              "Swing Trading",
              "All"
            ],
            correct: 2
          },
          {
            question: "True or False: Swing trading is low-risk.",
            choices: [
              "True",
              "False"
            ],
            correct: 1
          }
        ]
      },
      { 
        id: "8", 
        title: "Chapter 8: Market Psychology", 
        videoUrl: "/video/chapitre8.mp4", 
        quizUrl: "https://example.com/quiz-chapter-2",
        quiz: [
          {
            question: "What drives market prices?",
            choices: [
              "Fear and greed",
              "Wallets",
              "Exchanges",
              "Scams"
            ],
            correct: 0
          },
          {
            question: "What’s FOMO?",
            choices: [
              "Fear of Market Overload",
              "Fear of Missing Out",
              "A trading strategy",
              "A wallet type"
            ],
            correct: 1
          },
          {
            question: "How do you control emotions?",
            choices: [
              "Check prices constantly",
              "Set goals and stick to them",
              "Follow every rumor",
              "Sell when scared"
            ],
            correct: 1
          },
          {
            question: "True or False: FUD means prices are rising.",
            choices: [
              "True",
              "False"
            ],
            correct: 1
          }
        ]
      },
      { 
        id: "9", 
        title: "Chapter 9: Final Project", 
        videoUrl: "/video/chapitre9.mp4", 
        quizUrl: "https://example.com/quiz-chapter-2",
        quiz: [
          {
            question: "What’s the project for?",
            choices: [
              "Real investing",
              "Practicing what you learned",
              "Picking the top coin",
              "Trading fast"
            ],
            correct: 1
          },
          {
            question: "True or False: You need real money for this.",
            choices: [
              "True",
              "False"
            ],
            correct: 1
          },
          {
            question: "What’s in your plan?",
            choices: [
              "Coin, why, goal, amount, strategy, risk",
              "Just the coin",
              "A price guess",
              "A scam check"
            ],
            correct: 0
          }
        ]
      }
    ]
  }
];

const logoWatermark = (
  <svg width="180" height="90" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute opacity-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
    <path d="M30,45a45,45 0 1,1 120,0a45,45 0 1,1 -120,0" stroke="#fff" strokeWidth="8" fill="none" />
    <path d="M60,45a15,15 0 1,1 60,0a15,15 0 1,1 -60,0" stroke="#fff" strokeWidth="8" fill="none" />
  </svg>
);

function QuizQuestion({ question }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="mb-6">
      <div className="font-semibold text-white mb-2">{question.question}</div>
      <div className="flex flex-col gap-2">
        {question.choices.map((choice, idx) => {
          let color = "bg-white/20 text-white hover:bg-company-secondary/60";
          if (selected !== null) {
            if (idx === question.correct && selected === idx) color = "bg-green-500 text-white";
            else if (selected === idx && idx !== question.correct) color = "bg-red-500 text-white";
            else if (idx === question.correct) color = "bg-green-500/80 text-white";
            else color = "bg-white/10 text-white opacity-60";
          }
          return (
            <button
              key={idx}
              className={`rounded-lg px-4 py-2 font-medium transition-all border border-white/20 focus:outline-none ${color}`}
              disabled={selected !== null}
              onClick={() => setSelected(idx)}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// FocusDetection component using camera-based eye tracking + phone detection

const FocusDetection = () => {
  const videoRef = useRef(null);
  const { toast } = useToast();
  const notFocusedRef = useRef(false);
  const lastNotificationRef = useRef(0);
  const noFaceStartTimeRef = useRef(null);
  const lastPhoneDetectedRef = useRef(0);
  const [debugInfo, setDebugInfo] = useState("Initializing...");
  const cocoModelRef = useRef(null);
  const [phoneDetected, setPhoneDetected] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  // Emotion detection refs (do not alter existing phone/face logic)
  const annoyedFramesRef = useRef(0);
  const lastEmotionNotificationRef = useRef(0);
  const prevEyeRatioRef = useRef(0);
  const prevMouthRatioRef = useRef(0);
  const annoyedStartMsRef = useRef<number | null>(null);
  const [showStressNotif, setShowStressNotif] = useState(false);

  useEffect(() => {
    let destroyed = false;
    let stream = null;
    let canvas = null;
    let ctx = null;
    let lastFrame = null;
    let frameCount = 0;
    
    // Ensure TFJS backend is ready (prefer WebGL)
    tf.ready().then(async () => {
      try {
        await tf.setBackend('webgl');
      } catch {}
    });
    
    // Load COCO-SSD model for phone detection (lite model for speed)
    cocoSsd.load({ base: 'lite_mobilenet_v2' }).then(model => {
      cocoModelRef.current = model;
      setDebugInfo(d => d + ' | COCO-SSD loaded');
    });
    
    // Test notification immediately to ensure toast works
    setTimeout(() => {
      if (!destroyed) {
        console.log("Testing toast notification...");
        toast({
          title: "Focus Detection Active",
          description: "Camera monitoring is now active. Look away for 3+ seconds to test.",
        });
        setDebugInfo("Toast test sent");
      }
    }, 2000);
    
    async function startCamera() {
      try {
        console.log("Starting camera...");
        setDebugInfo("Starting camera...");
        
        // Get camera stream with better settings
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 320, 
            height: 240,
            facingMode: 'user',
            frameRate: { ideal: 10, max: 15 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          
          // Create canvas for face detection
          canvas = document.createElement('canvas');
          canvas.width = 320;
          canvas.height = 240;
          ctx = canvas.getContext('2d');
          
          console.log("Camera started successfully");
          setDebugInfo("Camera active - monitoring");
          
          // Start face detection
          detectFace();
        }
      } catch (error) {
        console.error("Camera error:", error);
        setDebugInfo("Camera error: " + error.message);
        
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
        // Draw current frame to canvas
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        const currentFrame = ctx.getImageData(0, 0, 320, 240);
        
        if (lastFrame) {
          // Face detection
          let skinPixels = 0;
          const data = currentFrame.data;
          const width = 320;
          const height = 240;
          // Emotion metrics counters
          let eyeDarkCount = 0;      // upper 40% region
          let eyeTotalCount = 0;
          let mouthDarkCount = 0;    // lower 35% region
          let mouthTotalCount = 0;
          const eyeMaxY = Math.floor(height * 0.40);
          const mouthMinY = Math.floor(height * 0.65);

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Compute y coordinate for this pixel
            const pixelIndex = i >> 2; // divide by 4
            const y = Math.floor(pixelIndex / width);

            // Skin tone detection (simplified)
            if (
              r > 95 && g > 40 && b > 20 &&
              Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
              Math.abs(r - g) > 15 && r > g && r > b
            ) {
              skinPixels++;
            }

            // Simple darkness-based heuristics for emotion cues
            const brightness = r + g + b; // 0..765
            if (y < eyeMaxY) {
              eyeTotalCount++;
              if (brightness < 150) eyeDarkCount++; // increased sensitivity
            } else if (y >= mouthMinY) {
              mouthTotalCount++;
              if (brightness < 160) mouthDarkCount++; // increased sensitivity
            }
          }
          
          // Calculate skin pixel percentage
          const totalPixels = data.length / 4;
          const skinPercentage = (skinPixels / totalPixels) * 100;
          
          // Face detected if skin percentage is above threshold
          const skinThreshold = 15; // Adjust this value
          const isFace = skinPercentage > skinThreshold;
          setFaceDetected(isFace);

          // Emotion detection (annoyed) based on eye/mouth darkness ratios
          if (isFace && eyeTotalCount > 0 && mouthTotalCount > 0) {
            const eyeDarkRatio = eyeDarkCount / eyeTotalCount;       // higher -> squint/roll/closed
            const mouthDarkRatio = mouthDarkCount / mouthTotalCount; // higher -> frown/blow shadow

            // Spike detection (compare to smoothed previous ratios)
            const prevEye = prevEyeRatioRef.current;
            const prevMouth = prevMouthRatioRef.current;
            const eyeSpike = eyeDarkRatio - prevEye > 0.07;
            const mouthSpike = mouthDarkRatio - prevMouth > 0.06;

            // Update smoothed history
            prevEyeRatioRef.current = prevEye * 0.6 + eyeDarkRatio * 0.4;
            prevMouthRatioRef.current = prevMouth * 0.6 + mouthDarkRatio * 0.4;

            // Heuristic thresholds and consecutive frame requirement (more sensitive)
            if (
              eyeDarkRatio > 0.18 ||
              mouthDarkRatio > 0.14 ||
              eyeSpike ||
              mouthSpike
            ) {
              if (annoyedStartMsRef.current === null) {
                annoyedStartMsRef.current = Date.now();
              }
              annoyedFramesRef.current += 1;
            } else {
              annoyedFramesRef.current = 0;
              annoyedStartMsRef.current = null;
            }

            // Trigger after ~3 frames to be responsive
            const nowMs = Date.now();
            const annoyedDurationMs =
              annoyedStartMsRef.current !== null ? nowMs - annoyedStartMsRef.current : 0;
            // 2.5 frames at ~10 FPS ~= 250ms
            if (
              annoyedDurationMs >= 250 &&
              nowMs - lastEmotionNotificationRef.current > 10000
            ) {
              lastEmotionNotificationRef.current = nowMs;
              setShowStressNotif(true);
              // Hide the image after 5 seconds
              setTimeout(() => {
                setShowStressNotif(false);
              }, 5000);
            }
          } else {
            annoyedFramesRef.current = 0;
          }
          
          frameCount++;
          if (frameCount % 10 === 0) {
            setDebugInfo(`Phone: ${phoneDetected ? 'Detected' : 'Not Detected'} | Face: ${isFace ? 'Detected' : 'Not Detected'}`);
          }
          
          const now = Date.now();
          
          if (!isFace) {
            // No face detected
            if (noFaceStartTimeRef.current === null) {
              noFaceStartTimeRef.current = now;
              console.log("No face detected, starting timer...");
            }
            
            // Check if more than 3 seconds have passed without a face
            if (now - noFaceStartTimeRef.current > 3000 && !notFocusedRef.current) {
              notFocusedRef.current = true;
              lastNotificationRef.current = now;
              
              console.log("Showing focus notification after 3 seconds");
              setDebugInfo("Sending notification!");
              toast({
                title: "Hey, you are not focusing!",
                description: "Please pay attention to the course.",
              });
            }
          } else {
            // Face detected - reset tracking
            if (noFaceStartTimeRef.current !== null) {
              console.log("Face detected, resetting timer");
            }
            noFaceStartTimeRef.current = null;
            notFocusedRef.current = false;
          }

          // Phone detection with COCO-SSD (every 5th frame ~2x per second)
          if (cocoModelRef.current && frameCount % 5 === 0) {
            cocoModelRef.current
              .detect(videoRef.current)
              .then((predictions) => {
                const phone = predictions.find(
                  (p) => p.class === 'cell phone' && p.score > 0.3
                );
                const isPhoneDetectedNow = !!phone;
                setPhoneDetected(isPhoneDetectedNow);
                
                // Update debug info immediately with current detection results
                setDebugInfo(
                  `Phone: ${isPhoneDetectedNow ? 'Detected' : 'Not Detected'} | Face: ${isFace ? 'Detected' : 'Not Detected'}`
                );
                
                if (phone) {
                  const nowInner = Date.now();
                  if (nowInner - lastPhoneDetectedRef.current > 8000) {
                    lastPhoneDetectedRef.current = nowInner;
                    toast({
                      title: "PHONE DETECTED: Please pay attention",
                      description:
                        "Please put your phone away and pay attention to the course.",
                      variant: "destructive",
                    });
                  }
                }
              })
              .catch((err) => {
                console.error('COCO-SSD detect error', err);
              });
          }
        }
        
        lastFrame = currentFrame;
        
        // Continue detection with lower frequency for stability
        setTimeout(() => {
          if (!destroyed) {
            detectFace();
          }
        }, 100); // 10 FPS instead of 60 FPS
      } catch (error) {
        console.error("Face detection error:", error);
        setDebugInfo("Face detection error");
      }
    }
    
    // Periodic check for extended periods without focus
    const focusInterval = setInterval(() => {
      if (!destroyed && notFocusedRef.current) {
        const now = Date.now();
        // Only show notification every 10 seconds to avoid spam
        if (now - lastNotificationRef.current > 10000) {
          lastNotificationRef.current = now;
          console.log("Showing periodic focus notification");
          setDebugInfo("Periodic notification sent");
          toast({
            title: "Hey, you are not focusing!",
            description: "Please pay attention to the course.",
          });
        }
      }
    }, 5000);
    
    startCamera();
    
    return () => {
      destroyed = true;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearInterval(focusInterval);
    };
  }, [toast]);
  
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
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Redirect to Coming Soon page for courses 3, 4, 5, 6 (1 and 2 are ready)
  useEffect(() => {
    const comingSoonCourses = ["3", "4", "5", "6"];
    if (comingSoonCourses.includes(id || "")) {
      navigate(`/coming-soon/${id}`);
      return;
    }
  }, [id, navigate]);
  
  const course = courses.find(c => c.id === id) || courses[0];
  const [selectedChapter, setSelectedChapter] = useState(course.chapters[0].id);
  const chapter = course.chapters.find(ch => ch.id === selectedChapter);
  const [showQuiz, setShowQuiz] = useState(false);

  // Shuffle quiz questions and choices once per session (per course)
  const shuffledQuizzesByChapterId = useMemo(() => {
    function shuffleArray<T>(arr: T[]): T[] {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
    function shuffleQuestion(q: any) {
      const indexed = (q.choices || []).map((choice: string, idx: number) => ({ choice, idx }));
      const shuffled: Array<{ choice: string; idx: number }> = shuffleArray(indexed);
      const newCorrect = shuffled.findIndex((x: { choice: string; idx: number }) => x.idx === q.correct);
      return { question: q.question, choices: shuffled.map((x: { choice: string }) => x.choice), correct: newCorrect };
    }
    const map: Record<string, any[]> = {};
    for (const ch of course.chapters) {
      if (Array.isArray((ch as any).quiz)) {
        map[ch.id] = shuffleArray((ch as any).quiz.map(shuffleQuestion));
      }
    }
    return map;
  }, [course.id]);

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-gradient-to-br from-white via-company-primary to-company-secondary animate-gradient-x relative overflow-hidden">
      {/* Focus Detection AI */}
      <FocusDetection />
      {/* Course Chatbot */}
      {course.id === "1" ? (
        <CourseChatbot
          label="Blockchain Fundamentals Chat"
          intentsPath="/intentsb.json"
          scopeDescription="Blockchain Fundamentals topics like distributed ledgers, cryptography, keys/signatures, smart contracts, privacy, consensus, and applications"
          placeholder="Ask about blockchain, DLT, cryptography, smart contracts…"
          strictGuard={false}
        />
      ) : (
        <CourseChatbot />
      )}
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-company-primary to-company-secondary opacity-80 blur-2xl animate-gradient-x z-0" />
      <div className="w-full max-w-3xl relative z-10 flex">
        <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-4 sm:p-10 border border-white/20 overflow-hidden flex-1">
          {/* Watermark */}
          {logoWatermark}
          {/* Course Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight text-center drop-shadow-xl font-sans">
            {course.title}
          </h1>
          <div className="text-center text-company-secondary text-lg italic mb-4 font-glacial">“Knowledge is the new gold.”</div>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-company-secondary via-company-primary to-company-pink rounded-full mb-8" />

          {/* Chapter Boxes */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {course.chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => { setSelectedChapter(ch.id); setShowQuiz(false); }}
                className={`transition-all px-6 py-4 rounded-2xl font-semibold shadow-lg border-2 focus:outline-none focus:ring-2 focus:ring-company-primary/60 flex items-center gap-3 relative
                  ${selectedChapter === ch.id
                    ? 'bg-company-primary text-white border-company-primary scale-105 drop-shadow-2xl ring-4 ring-company-secondary/30'
                    : 'bg-white/20 text-company-primary border-white/30 hover:bg-company-primary/80 hover:text-white hover:shadow-xl'}
                `}
                style={{ minWidth: 180 }}
              >
                <span className="inline-block w-7 h-7 bg-gradient-to-br from-company-secondary to-company-pink rounded-full flex items-center justify-center shadow-md">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="white" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2"/></svg>
                </span>
                <span className="text-lg font-bold">{ch.title}</span>
                {selectedChapter === ch.id && <span className="absolute -top-2 -right-2 w-4 h-4 bg-company-gold rounded-full shadow-lg border-2 border-white animate-pulse" />}
              </button>
            ))}
          </div>

          {/* Selected Chapter Content */}
          {chapter && (
            <div className="bg-white/20 rounded-2xl p-8 shadow-xl border border-white/20 relative">
              <h2 className="text-2xl font-bold text-company-primary mb-6 text-center tracking-wide drop-shadow">{chapter.title}</h2>
              {/* Video */}
              <div className="rounded-xl overflow-hidden mb-8 border-4 border-company-secondary shadow-lg">
                <video
                  src={chapter.videoUrl}
                  controls
                  className="w-full h-40 sm:h-64 md:h-96 bg-black"
                />
              </div>
              {/* Quiz Link and Interactive Quiz */}
              <div className="flex flex-col items-center">
                {!showQuiz && chapter.quiz && (
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="inline-block bg-company-primary hover:bg-company-secondary text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-xl shadow-lg transition-colors duration-200 text-lg sm:text-xl tracking-wide border-2 border-company-secondary mb-6"
                  >
                    Take the Quiz
                  </button>
                )}
                {showQuiz && chapter.quiz && (
                  <div className="w-full max-w-xl">
                    <h3 className="text-lg sm:text-xl font-bold text-company-secondary mb-4">Quiz</h3>
                    {(shuffledQuizzesByChapterId[chapter.id] || chapter.quiz).map((q, qi) => (
                      <QuizQuestion key={qi} question={q} />
                    ))}
                  </div>
                )}
              </div>
      </div>
          )}
      </div>
        {/* Final Assessment Button for Crypto Chapter 9 */}
        {chapter && course.id === "2" && chapter.id === "9" && (
          <div className="absolute z-50 flex items-center" style={{ left: '100%', top: '95%', transform: 'translateY(-50%)', marginLeft: '9rem' }}>
            <button
              className="bg-company-primary hover:bg-company-secondary text-white font-bold py-4 px-12 rounded-xl shadow-lg transition-colors duration-200 text-xl border-4 border-company-secondary outline-none"
              onClick={() => navigate('/final-assessment')}
            >
              Final Assessment
            </button>
      </div>
        )}
        {/* Final Assessment Button for Blockchain Chapter 8 */}
        {chapter && course.id === "1" && chapter.id === "8" && (
          <div className="absolute z-50 flex items-center" style={{ left: '100%', top: '95%', transform: 'translateY(-50%)', marginLeft: '9rem' }}>
            <button
              className="bg-company-primary hover:bg-company-secondary text-white font-bold py-4 px-12 rounded-xl shadow-lg transition-colors duration-200 text-xl border-4 border-company-secondary outline-none"
              onClick={() => navigate('/final-assessment-blockchain')}
            >
              Final Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail; 
