import React, { useMemo, useState } from "react";
import FocusDetection from "@/components/FocusDetection";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    question: "What is a key reason to research before investing in crypto?",
    choices: [
      "To follow social media trends",
      "To ensure guaranteed profits",
      "To make informed decisions",
      "To reduce transaction speeds"
    ],
    correct: 2
  },
  {
    question: "What defines a cryptocurrency?",
    choices: [
      "A physical coin for trading",
      "A digital asset secured by cryptography",
      "A stock market derivative",
      "A centralized payment system"
    ],
    correct: 1
  },
  {
    question: "What makes a blockchain secure?",
    choices: [
      "Central authority control",
      "Immutable, decentralized ledger",
      "Hidden transaction records",
      "Limited user access"
    ],
    correct: 1
  },
  {
    question: "How do tokens differ from coins?",
    choices: [
      "Tokens have their own blockchains",
      "Coins are less secure than tokens",
      "Tokens operate on existing blockchains",
      "Coins are only for payments"
    ],
    correct: 2
  },
  {
    question: "What does a crypto wallet primarily store?",
    choices: [
      "Digital coins directly",
      "Private and public keys",
      "Exchange login credentials",
      "Transaction fees"
    ],
    correct: 1
  },
  {
    question: "Why are cold wallets preferred for long-term storage?",
    choices: [
      "They are always online",
      "They are offline, reducing hack risks",
      "They offer faster transactions",
      "They are free to use"
    ],
    correct: 1
  },
  {
    question: "How should you handle your seed phrase?",
    choices: [
      "Share it with support teams",
      "Store it securely offline",
      "Use it as a password",
      "Post it online for backup"
    ],
    correct: 1
  },
  {
    question: "What feature makes centralized exchanges (CEXs) accessible?",
    choices: [
      "No need for verification",
      "User-friendly interfaces and support",
      "Fully decentralized trading",
      "Offline access"
    ],
    correct: 1
  },
  {
    question: "What does KYC verification involve?",
    choices: [
      "Securing private keys",
      "Checking wallet balances",
      "Confirming user identity",
      "Reducing trading fees"
    ],
    correct: 2
  },
  {
    question: "Why is two-factor authentication (2FA) recommended?",
    choices: [
      "It increases trading limits",
      "It enhances account security",
      "It skips KYC requirements",
      "It lowers market risks"
    ],
    correct: 1
  },
  {
    question: "What characterizes a decentralized exchange (DEX)?",
    choices: [
      "Company-managed platform",
      "Peer-to-peer trading without intermediaries",
      "Hardware-based trading",
      "Government-regulated system"
    ],
    correct: 1
  },
  {
    question: "What should you check before using an exchange?",
    choices: [
      "Its social media presence",
      "Its security and reputation",
      "Its advertising budget",
      "Its transaction speed"
    ],
    correct: 1
  },
  {
    question: "What is a limit order?",
    choices: [
      "Buying at the current market price",
      "Setting a specific price for a trade",
      "Transferring crypto to a wallet",
      "Canceling a transaction"
    ],
    correct: 1
  },
  {
    question: "Why move crypto to a personal wallet after purchase?",
    choices: [
      "To reduce fees",
      "To protect against exchange hacks",
      "To earn interest",
      "To speed up trades"
    ],
    correct: 1
  },
  {
    question: "What happens if you send crypto to the wrong address?",
    choices: [
      "The exchange recovers it",
      "The funds are usually lost",
      "It triggers a refund",
      "The transaction is paused"
    ],
    correct: 1
  },
  {
    question: "What does diversification achieve in crypto investing?",
    choices: [
      "Focuses investments on one asset",
      "Spreads risk across multiple assets",
      "Guarantees high returns",
      "Simplifies trading"
    ],
    correct: 1
  },
  {
    question: "What is the benefit of dollar-cost averaging (DCA)?",
    choices: [
      "It ensures quick profits",
      "It minimizes price volatility impact",
      "It requires constant trading",
      "It maximizes risk"
    ],
    correct: 1
  },
  {
    question: "What does a stop-loss order do?",
    choices: [
      "Buys crypto at a lower price",
      "Sells crypto if prices drop to a set level",
      "Secures wallet backups",
      "Increases trading volume"
    ],
    correct: 1
  },
  {
    question: "What is a warning sign of a crypto scam?",
    choices: [
      "Transparent team information",
      "Claims of guaranteed profits",
      "Detailed project plans",
      "Community endorsements"
    ],
    correct: 1
  },
  {
    question: "How can you avoid phishing scams?",
    choices: [
      "Share private keys with trusted sites",
      "Ignore unsolicited requests for keys",
      "Click links in unknown emails",
      "Use public Wi-Fi for trades"
    ],
    correct: 1
  },
  {
    question: "What should you do if asked for your private keys?",
    choices: [
      "Provide them to verify your account",
      "Report it as a potential scam",
      "Use them to log in",
      "Save them in the platform"
    ],
    correct: 1
  },
  {
    question: "What does the HODL strategy emphasize?",
    choices: [
      "Daily trading for profits",
      "Long-term holding through market swings",
      "Selling during dips",
      "Borrowing for investments"
    ],
    correct: 1
  },
  {
    question: "Who is swing trading best for?",
    choices: [
      "Beginners avoiding risk",
      "Traders handling short-term price moves",
      "Long-term investors",
      "Passive investors"
    ],
    correct: 1
  },
  {
    question: "What risk does emotional trading pose?",
    choices: [
      "Missing diversification",
      "Impulsive decisions driven by fear or greed",
      "Guaranteed losses",
      "Slower transactions"
    ],
    correct: 1
  },
  {
    question: "What does FOMO often cause in crypto markets?",
    choices: [
      "Selling during stable prices",
      "Buying at inflated prices due to hype",
      "Avoiding investments",
      "Using secure wallets"
    ],
    correct: 1
  }
];

function FinalAssessment() {
  const [selected, setSelected] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const handleSelect = (qi, idx) => {
    if (submitted) return;
    setSelected(prev => {
      const copy = [...prev];
      copy[qi] = idx;
      return copy;
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    let answered = 0;
    selected.forEach((ans, i) => {
      if (ans !== null) {
        answered++;
        if (ans === shuffledQuestions[i].correct) correct++;
      }
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
    // Download the Certificate.pdf file
    const a = document.createElement('a');
    a.href = '/Certificate.pdf';
    a.download = 'Certificate.pdf';
    a.click();
  };

  // Shuffle per session so order varies each refresh
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-company-primary to-company-secondary py-12 px-2 flex justify-center items-start relative">
      {/* AI focus/phone detection */}
      <FocusDetection />
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight text-center drop-shadow-lg">Final Assessment</h1>
        <p className="text-lg text-company-secondary text-center mb-8">Answer all questions. You must get at least 15 correct to pass.</p>
        {shuffledQuestions.map((q, qi) => (
          <div key={qi} className="mb-8">
            <div className="font-semibold text-white mb-2">{qi + 1}. {q.question}</div>
            <div className="flex flex-col gap-2">
              {q.choices.map((choice, idx) => {
                let color = "bg-white/20 text-white hover:bg-company-secondary/60";
                if (selected[qi] !== null) {
                  if (idx === q.correct && selected[qi] === idx) color = "bg-green-500 text-white";
                  else if (selected[qi] === idx && idx !== q.correct) color = "bg-red-500 text-white";
                  else if (idx === q.correct) color = "bg-green-500/80 text-white";
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

export default FinalAssessment; 