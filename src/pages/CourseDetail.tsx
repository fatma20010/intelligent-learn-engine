import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Sample course data
const courses = [
  {
    id: "1",
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
  const [selected, setSelected] = React.useState(null);
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

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Redirect to Coming Soon page for courses 1, 3, 4, 5, 6
  useEffect(() => {
    const comingSoonCourses = ["1", "3", "4", "5", "6"];
    if (comingSoonCourses.includes(id || "")) {
      navigate(`/coming-soon/${id}`);
      return;
    }
  }, [id, navigate]);
  
  const course = courses.find(c => c.id === id) || courses[0];
  const [selectedChapter, setSelectedChapter] = useState(course.chapters[0].id);
  const chapter = course.chapters.find(ch => ch.id === selectedChapter);
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-gradient-to-br from-company-primary via-[#3F2097] to-company-secondary animate-gradient-x relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-company-primary via-[#3F2097] to-company-secondary opacity-80 blur-2xl animate-gradient-x z-0" />
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
                    {chapter.quiz.map((q, qi) => (
                      <QuizQuestion key={qi} question={q} />
                    ))}
                  </div>
                )}
              </div>
      </div>
          )}
      </div>
        {/* Final Assessment Button for Chapter 9 - outside the card, right side, vertically centered */}
        {chapter && chapter.id === "9" && (
          <div className="absolute z-50 flex items-center" style={{ left: '100%', top: '95%', transform: 'translateY(-50%)', marginLeft: '9rem' }}>
            <button
              className="bg-company-primary hover:bg-company-secondary text-white font-bold py-4 px-12 rounded-xl shadow-lg transition-colors duration-200 text-xl border-4 border-company-secondary outline-none"
              onClick={() => navigate('/final-assessment')}
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
