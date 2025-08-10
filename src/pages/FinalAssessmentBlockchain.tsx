import React, { useMemo, useState } from "react";
import FocusDetection from "@/components/FocusDetection";
import CourseChatbot from "@/components/CourseChatbot";
import { useNavigate } from "react-router-dom";

// 25 questions covering Blockchain Fundamentals
const questions = [
  {
    question: "What best describes a blockchain?",
    choices: [
      "A centralized database",
      "A decentralized, immutable ledger of blocks linked by hashes",
      "An encrypted spreadsheet file",
      "A private server log only banks can access",
    ],
    correct: 1,
  },
  {
    question: "Which property prevents past blocks from being altered without detection?",
    choices: ["Sharding", "Immutability via hashing and links", "Compression", "Caching"],
    correct: 1,
  },
  {
    question: "What is a distributed ledger (DLT)?",
    choices: [
      "A ledger kept by a single administrator",
      "A database replicated across multiple nodes that share updates",
      "A paper log shared by couriers",
      "A cloud backup of a website",
    ],
    correct: 1,
  },
  {
    question: "Public (permissionless) vs private (permissioned) blockchains—what is true?",
    choices: [
      "Public chains require approval to join",
      "Private chains are open to everyone",
      "Public chains are open, private chains restrict participation",
      "They are identical in access",
    ],
    correct: 2,
  },
  {
    question: "Which component links a block to its predecessor?",
    choices: ["Nonce", "Timestamp", "Previous block hash", "Merkle root"],
    correct: 2,
  },
  {
    question: "What does a cryptographic hash function (e.g., SHA-256) provide?",
    choices: [
      "Reversible encryption of data",
      "Fixed-length fingerprint; small changes produce different outputs",
      "Faster file transfers",
      "Human-readable summaries",
    ],
    correct: 1,
  },
  {
    question: "Public and private keys are used to…",
    choices: [
      "Compress blocks",
      "Identify and authorize transactions with digital signatures",
      "Encrypt the entire blockchain",
      "Generate new tokens automatically",
    ],
    correct: 1,
  },
  {
    question: "What is a digital signature in blockchain?",
    choices: [
      "A handwritten sign stored on-chain",
      "Proof a transaction came from the private key holder and wasn’t altered",
      "A QR code in the block",
      "A fee receipt",
    ],
    correct: 1,
  },
  {
    question: "What is a smart contract?",
    choices: [
      "A paper contract scanned to PDF",
      "Self-executing code on a blockchain that runs when conditions are met",
      "A bank agreement",
      "A digital signature standard",
    ],
    correct: 1,
  },
  {
    question: "Which platform popularized smart contracts and DApps?",
    choices: ["Bitcoin", "Ethereum", "Litecoin", "Dogecoin"],
    correct: 1,
  },
  {
    question: "DApps are…",
    choices: [
      "Centralized apps with login",
      "Apps powered by smart contracts with no single owner",
      "Mobile games only",
      "Offline tools",
    ],
    correct: 1,
  },
  {
    question: "What does the nonce in Proof of Work mining relate to?",
    choices: [
      "A counter miners vary to find a valid hash",
      "A network port",
      "A user’s account ID",
      "A token supply cap",
    ],
    correct: 0,
  },
  {
    question: "Which consensus uses validators staking coins instead of heavy computation?",
    choices: ["Proof of Work", "Proof of Stake", "Proof of Burn", "Proof of Elapsed Time"],
    correct: 1,
  },
  {
    question: "Zero-knowledge proofs (ZKPs) allow…",
    choices: [
      "Revealing secrets to verify identity",
      "Proving a statement is true without revealing the underlying data",
      "Compressing blocks",
      "Minting NFTs",
    ],
    correct: 1,
  },
  {
    question: "Off-chain computation typically means…",
    choices: [
      "Running heavy work outside the chain and posting results on-chain",
      "Deleting old blocks",
      "Printing paper reports",
      "Preventing consensus",
    ],
    correct: 0,
  },
  {
    question: "A block normally contains…",
    choices: [
      "Only a timestamp",
      "Transactions, timestamp, its hash, and previous block hash",
      "Just a random number",
      "Only smart contracts",
    ],
    correct: 1,
  },
  {
    question: "Why is immutability valuable?",
    choices: [
      "It allows edits to past transactions",
      "It ensures recorded data can’t be altered unnoticed",
      "It speeds up mobile apps",
      "It reduces disk usage",
    ],
    correct: 1,
  },
  {
    question: "What’s the main purpose of Merkle trees?",
    choices: [
      "Decorative block structure",
      "Efficiently summarize and verify large sets of transactions",
      "Replace signatures",
      "Encrypt balances",
    ],
    correct: 1,
  },
  {
    question: "A permissioned ledger is best for…",
    choices: [
      "Open communities with anonymous users",
      "Organizations needing controlled access and compliance",
      "Consumer NFTs",
      "Gaming only",
    ],
    correct: 1,
  },
  {
    question: "Which statement about tokens is correct?",
    choices: [
      "All tokens have their own blockchains",
      "Tokens typically run on existing blockchains via standards (e.g., ERC-20)",
      "Tokens are always stablecoins",
      "Tokens replace hashes",
    ],
    correct: 1,
  },
  {
    question: "What does a private key enable?",
    choices: [
      "Receiving funds only",
      "Authorizing transactions (keep it secret)",
      "Faster mining",
      "Exploring the ledger",
    ],
    correct: 1,
  },
  {
    question: "What’s a common risk if a private key is exposed?",
    choices: [
      "Slow blocks",
      "Unauthorized spending of funds",
      "Invalidating consensus",
      "Faster confirmations",
    ],
    correct: 1,
  },
  {
    question: "How can a university issue verifiable online diplomas on-chain?",
    choices: [
      "Scanned PDFs in email",
      "Smart contracts with decentralized identity (DID)",
      "Phone support",
      "Manual approvals",
    ],
    correct: 1,
  },
  {
    question: "Which is a typical on-chain verification method?",
    choices: [
      "Comparing file hashes",
      "Asking support via chat",
      "Taking screenshots",
      "Printing documents",
    ],
    correct: 0,
  },
  {
    question: "Which statement about block validation is correct?",
    choices: [
      "Nodes validate transactions and blocks before adding them to the chain",
      "Blocks are added without checks",
      "Only one node validates blocks",
      "Validation is optional",
    ],
    correct: 0,
  },
  {
    question: "What does decentralization help reduce?",
    choices: [
      "Single point of failure and tampering risk",
      "Network size",
      "The need for cryptography",
      "All computation",
    ],
    correct: 0,
  },
];

export default function FinalAssessmentBlockchain() {
  const [selected, setSelected] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const handleSelect = (qi: number, idx: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const copy = [...prev];
      copy[qi] = idx;
      return copy;
    });
  };

  // Shuffle per session refresh
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const shuffleQuestion = (q: any) => {
    const indexed = (q.choices as string[]).map((choice, idx) => ({ choice, idx }));
    const shuffled = shuffleArray(indexed);
    const newCorrect = shuffled.findIndex((x) => x.idx === q.correct);
    return { question: q.question, choices: shuffled.map((x) => x.choice), correct: newCorrect };
  };
  const shuffledQuestions = useMemo(() => shuffleArray(questions).map(shuffleQuestion), []);

  const handleSubmit = () => {
    let correct = 0;
    selected.forEach((ans, i) => {
      if (ans !== null && ans === (shuffledQuestions[i] as any).correct) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setSelected(Array(questions.length).fill(null));
    setSubmitted(false);
    setScore(0);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/Certificate1.pdf";
    a.download = "Certificate1.pdf";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-company-primary to-company-secondary py-12 px-2 flex justify-center items-start relative">
      {/* AI focus/phone detection */}
      <FocusDetection />
      {/* Course chatbot (Blockchain Fundamentals) */}
      <CourseChatbot
        label="Blockchain Fundamentals Chat"
        intentsPath="/intentsb.json"
        scopeDescription="Blockchain Fundamentals topics like distributed ledgers, cryptography, keys/signatures, smart contracts, privacy, consensus, and applications"
        placeholder="Ask about blockchain, DLT, cryptography, smart contracts…"
        strictGuard={false}
      />
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight text-center drop-shadow-lg">Final Assessment – Blockchain Fundamentals</h1>
        <p className="text-lg text-company-secondary text-center mb-8">Answer all questions. You must get at least 15 correct to pass.</p>
        {shuffledQuestions.map((q, qi) => (
          <div key={qi} className="mb-8">
            <div className="font-semibold text-white mb-2">{qi + 1}. {(q as any).question}</div>
            <div className="flex flex-col gap-2">
              {(q as any).choices.map((choice: string, idx: number) => {
                let color = "bg-white/20 text-white hover:bg-company-secondary/60";
                if (selected[qi] !== null) {
                  if (idx === (q as any).correct && selected[qi] === idx) color = "bg-green-500 text-white";
                  else if (selected[qi] === idx && idx !== (q as any).correct) color = "bg-red-500 text-white";
                  else if (idx === (q as any).correct) color = "bg-green-500/80 text-white";
                  else color = "bg-white/10 text-white opacity-60";
                }
                return (
                  <button
                    key={idx}
                    className={`rounded-lg px-4 py-2 font-medium transition-all border border-white/20 focus:outline-none ${color}`}
                    disabled={selected[qi] !== null || submitted}
                    onClick={() => handleSelect(qi, idx)}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {!submitted && (
          <div className="flex justify-center mt-8">
            <button
              className="bg-company-primary hover:bg-company-secondary text-white font-bold py-3 px-10 rounded-xl shadow-lg transition-colors duration-200 text-xl border-2 border-company-secondary"
              onClick={handleSubmit}
            >
              Submit Assessment
            </button>
          </div>
        )}
        {submitted && (
          <div className="flex flex-col items-center mt-8">
            {score >= 15 ? (
              <>
                <div className="text-2xl font-bold text-green-400 mb-4">Congratulations! You passed 🎉</div>
                <div className="text-lg text-white mb-6">Score: {score}/25</div>
                <button
                  className="bg-company-primary hover:bg-company-secondary text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200 text-lg border-2 border-company-secondary mb-4"
                  onClick={handleDownload}
                >
                  Download Certificate
                </button>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-red-400 mb-4">We are sorry, you failed. Try again.</div>
                <div className="text-lg text-white mb-6">Score: {score}/25</div>
                <button
                  className="bg-company-primary hover:bg-company-secondary text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200 text-lg border-2 border-company-secondary"
                  onClick={handleRetry}
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

