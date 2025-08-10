import { useEffect, useMemo, useRef, useState } from "react";

type Intent = {
  tag: string;
  patterns: string[];
  responses: string[];
  context?: string[];
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\p{P}$+<=>^`~@#%&_*|\\/]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(text: string): Set<string> {
  const raw = normalize(text)
    .split(" ")
    .filter(Boolean)
    .map((w) => {
      // naive singularization to improve matches: contracts -> contract
      if (w.length > 4 && w.endsWith("s")) return w.slice(0, -1);
      return w;
    });
  return new Set(raw);
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type CourseChatbotProps = {
  label?: string;
  intentsPath?: string;
  scopeDescription?: string;
  placeholder?: string;
  strictGuard?: boolean;
};

export default function CourseChatbot({
  label = "Crypto Investing 101 Chat",
  intentsPath = "/intents.json",
  scopeDescription =
    "Crypto Investing 101 topics like blockchain, wallets, exchanges, buying, DCA, stop-loss, scams, HODL, swing trading, fear/greed, and FOMO",
  placeholder = "Ask about wallets, exchanges, buying, DCA, scams…",
  strictGuard = true,
}: CourseChatbotProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: crypto.randomUUID(),
    role: "assistant",
    text:
      `Hi! I’m your assistant for this course. I can help with ${scopeDescription}.`,
  }]);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadIntents() {
      setLoading(true);
      const trimmed = intentsPath.replace(/^\//, "");
      const base = (import.meta as any)?.env?.BASE_URL ?? "/";
      const makeWithBuster = (u: string) => `${u}${u.includes("?") ? "&" : "?"}v=${Date.now()}`;
      const rootAbsolute = new URL(trimmed, window.location.origin).toString();
      const candidates = Array.from(new Set([
        intentsPath,
        trimmed,
        `${base}${trimmed}`,
        rootAbsolute,
        makeWithBuster(intentsPath),
        makeWithBuster(trimmed),
        makeWithBuster(`${base}${trimmed}`),
        makeWithBuster(rootAbsolute),
      ]));
      let loaded: Intent[] = [];
      for (const url of candidates) {
        try {
          const res = await fetch(url, { cache: "no-cache" });
          if (!res.ok) continue;
          const data = await res.json();
        const parsed: Intent[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.intents)
            ? data.intents
            : [];
          if (parsed.length > 0) {
            loaded = parsed;
            break;
          }
        } catch (_) {
          // try next candidate
        }
      }
      // Last-resort built-in intents for Blockchain Fundamentals if external file failed
      if (loaded.length === 0 && /intentsb\.json$/i.test(trimmed)) {
        loaded = [
          {
            "tag": "blockchain_definition",
            "patterns": [
              "What is blockchain?",
              "Can you explain blockchain?",
              "How does blockchain work?",
              "Tell me about blockchain technology",
              "What's the definition of blockchain?"
            ],
            "responses": [
              "Blockchain is a decentralized, immutable ledger that records transactions in blocks linked together chronologically. Once data is added, it cannot be changed, and everyone in the network shares the same copy.",
              "It's a distributed database where information is stored in blocks, secured by cryptography, and verified by consensus among network participants."
            ],
            "context": [""]
          },
          {
            "tag": "blockchain_origins",
            "patterns": [
              "When was blockchain invented?",
              "Who created blockchain?",
              "Tell me about blockchain history",
              "What is the origin of blockchain?",
              "Who is Satoshi Nakamoto?"
            ],
            "responses": [
              "The concept of blockchain dates back to 1991, when it was proposed as a way to timestamp digital documents. It was brought to life in 2009 by Satoshi Nakamoto with the launch of Bitcoin.",
              "Blockchain began as a research concept in 1991, but became a reality in 2009 when Satoshi Nakamoto introduced it through Bitcoin."
            ],
            "context": [""]
          },
          {
            "tag": "bitcoin_intro",
            "patterns": [
              "What is Bitcoin?",
              "Why is Bitcoin important?",
              "Tell me about Bitcoin",
              "How does Bitcoin work?",
              "What's special about Bitcoin?"
            ],
            "responses": [
              "Bitcoin is the first and most famous cryptocurrency, running on a public blockchain. It allows secure, peer-to-peer transactions without the need for banks.",
              "Bitcoin is a decentralized digital currency introduced in 2009 by Satoshi Nakamoto. It uses Proof of Work to verify transactions."
            ],
            "context": [""]
          },
          {
            "tag": "key_properties_blockchain",
            "patterns": [
              "What are the main features of blockchain?",
              "Why is blockchain secure?",
              "What makes blockchain special?",
              "What are blockchain's key properties?"
            ],
            "responses": [
              "Blockchain is decentralized, meaning no single authority controls it. It is immutable, so once data is recorded it can't be changed, and it’s secure thanks to cryptography.",
              "Its key properties are decentralization, immutability, transparency, and cryptographic security."
            ],
            "context": [""]
          },
          {
            "tag": "block_structure",
            "patterns": [
              "What is inside a blockchain block?",
              "Explain block structure",
              "What data does a blockchain block contain?",
              "How is data stored in blockchain?"
            ],
            "responses": [
              "A blockchain block contains a list of transactions, a timestamp, its own cryptographic hash, and the hash of the previous block, linking it to the chain.",
              "Each block stores transaction data, the previous block's hash, its own hash, and a timestamp to ensure immutability."
            ],
            "context": [""]
          },
          {
            "tag": "block_validation",
            "patterns": [
              "How are blocks validated in blockchain?",
              "What is block validation?",
              "How do nodes verify blocks?",
              "Explain validation in blockchain"
            ],
            "responses": [
              "Blocks are validated through consensus mechanisms like Proof of Work or Proof of Stake, where participants verify transactions and agree on the block's correctness.",
              "Nodes check each transaction in a block for validity before it’s added to the blockchain."
            ],
            "context": [""]
          },
          {
            "tag": "distributed_ledger",
            "patterns": [
              "What is a distributed ledger?",
              "How does a distributed ledger work?",
              "Explain DLT",
              "What does DLT mean?",
              "Tell me about distributed ledger technology"
            ],
            "responses": [
              "A distributed ledger is a database spread across multiple nodes or locations, where all participants have a synchronized copy. It removes the need for a central authority and increases transparency.",
              "DLT means Distributed Ledger Technology — it's the underlying system behind blockchains where data is shared and updated across multiple computers."
            ],
            "context": [""]
          },
          {
            "tag": "centralized_vs_distributed",
            "patterns": [
              "Difference between centralized and distributed ledgers",
              "Why is distributed better than centralized?",
              "Explain centralized vs decentralized ledgers"
            ],
            "responses": [
              "In a centralized ledger, one authority controls the database. In a distributed ledger, multiple nodes share and verify the same data, reducing the risk of tampering.",
              "Centralized ledgers have a single point of control, while distributed ledgers rely on multiple participants, making them more resilient."
            ],
            "context": [""]
          },
          {
            "tag": "permissioned_vs_permissionless",
            "patterns": [
              "What is a permissioned blockchain?",
              "What is a permissionless blockchain?",
              "Difference between permissioned and permissionless blockchain",
              "Explain public vs private blockchain"
            ],
            "responses": [
              "A permissionless blockchain, like Bitcoin, is open for anyone to join and participate. A permissioned blockchain, like Hyperledger, restricts access to approved members.",
              "Public blockchains are open to all, while private (permissioned) blockchains limit participation to selected entities."
            ],
            "context": [""]
          },
          {
            "tag": "hyperledger_frameworks",
            "patterns": [
              "What is Hyperledger?",
              "Explain Hyperledger Fabric",
              "What is Hyperledger Sawtooth?",
              "Tell me about Hyperledger Burrow",
              "What are the types of Hyperledger frameworks?"
            ],
            "responses": [
              "Hyperledger is an open-source project by the Linux Foundation for developing enterprise blockchain solutions. Frameworks include Fabric, Sawtooth, and Burrow.",
              "Hyperledger Fabric is a permissioned blockchain designed for enterprises, while Sawtooth focuses on modular architecture, and Burrow supports smart contracts in Ethereum Virtual Machine format."
            ],
            "context": [""]
          },
          {
            "tag": "cryptography_in_blockchain",
            "patterns": [
              "How is cryptography used in blockchain?",
              "What role does cryptography play in blockchain?",
              "Explain cryptography in blockchain",
              "Tell me about hashing in blockchain"
            ],
            "responses": [
              "Blockchain uses cryptography to secure transactions and control the creation of new blocks. Hashing algorithms like SHA-256 ensure data integrity.",
              "Cryptography provides security in blockchain through hashing, public-private key pairs, and digital signatures."
            ],
            "context": [""]
          },
          {
            "tag": "hash_function",
            "patterns": [
              "What is hashing in blockchain?",
              "Explain SHA-256",
              "How does a hash work?",
              "What is the purpose of hashing?"
            ],
            "responses": [
              "Hashing converts any input into a fixed-length string. In blockchain, it ensures that data cannot be altered without detection. SHA-256 is the algorithm used in Bitcoin.",
              "A hash is like a digital fingerprint of data — unique, fixed-length, and irreversible."
            ],
            "context": [""]
          },
          {
            "tag": "public_private_keys",
            "patterns": [
              "What are public and private keys?",
              "Explain public and private keys in blockchain",
              "How do blockchain keys work?",
              "Why do I need a private key?"
            ],
            "responses": [
              "Public and private keys are cryptographic tools. The public key is like an address to receive funds, while the private key is a secret code to access them.",
              "Your public key is shared to receive transactions, but your private key must remain secret to secure your funds."
            ],
            "context": [""]
          },
          {
            "tag": "digital_signatures",
            "patterns": [
              "What is a digital signature in blockchain?",
              "How do digital signatures work?",
              "Why are digital signatures important?",
              "Explain signing transactions"
            ],
            "responses": [
              "A digital signature proves that a transaction came from the rightful owner and has not been altered. It's created using the sender's private key.",
              "Digital signatures ensure authenticity and integrity in blockchain transactions."
            ],
            "context": [""]
          },
          {
            "tag": "smart_contracts",
            "patterns": [
              "What is a smart contract?",
              "How do smart contracts work?",
              "Explain smart contracts",
              "What are DApps?"
            ],
            "responses": [
              "A smart contract is a self-executing agreement coded on the blockchain. Once conditions are met, it automatically carries out the terms.",
              "DApps, or decentralized applications, are powered by smart contracts and operate without central control."
            ],
            "context": [""]
          }
        ]
      }
      if (!cancelled) {
        setIntents(loaded);
        setLoading(false);
      }
    }
    loadIntents();
    return () => {
      cancelled = true;
    };
  }, [intentsPath]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const allExampleQuestions = useMemo(() => {
    const fallbacks = [
      "What is blockchain?",
      "What is a smart contract?",
      "Explain SHA-256",
      "What are public and private keys?",
      "What is a distributed ledger?",
    ];
    const fromIntents = intents.flatMap((it) => it.patterns?.slice(0, 2) || []);
    return (fromIntents.length > 0 ? fromIntents : fallbacks).slice(0, 8);
  }, [intents]);

  function classify(text: string): Intent | null {
    const userNorm = normalize(text);
    const userTokens = tokenSet(userNorm);

    let best: { score: number; intent: Intent | null } = { score: 0, intent: null };
    for (const intent of intents) {
      for (const pattern of intent.patterns || []) {
        const patTokens = tokenSet(pattern);
        const score = jaccardSimilarity(userTokens, patTokens);
        if (score > best.score) best = { score, intent };
        // Light substring boost
        if (userNorm.includes(normalize(pattern))) {
          const boosted = Math.max(best.score, 0.9);
          if (boosted > best.score) best = { score: boosted, intent };
        }
      }
    }

    // Thresholds tuned for short Q&A
    if (best.intent && best.score >= 0.25) return best.intent;
    return null;
  }

  function courseGuard(text: string): boolean {
    // If intents failed to load, don't block. Otherwise only allow topics we know.
    if (intents.length === 0) return true;
    return classify(text) !== null;
  }

  function respond(userText: string) {
    const intent = classify(userText);
    if (!intent) {
      return `I can help with ${scopeDescription}. Try asking, for example: ‘What is a crypto wallet?’`;
    }
    const resp = pickRandom(intent.responses || [
      "I have information about that topic in this course, but I couldn’t find a precise match. Could you rephrase?",
    ]);
    return resp;
  }

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);

    // Guard off-topic (optional)
    if (!courseGuard(text)) {
      if (strictGuard) {
      const guardMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
          text: `I only answer questions related to this course: ${scopeDescription}.`,
      };
      setMessages((m) => [...m, guardMsg]);
      return;
      }
      // If strictGuard is disabled, fall through to respond with best effort
    }

    const reply = respond(text);
    const botMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", text: reply };
    // Simulate latency for UX
    setTimeout(() => setMessages((m) => [...m, botMsg]), 250);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full w-14 h-14 shadow-xl bg-company-primary hover:bg-company-secondary text-white border-2 border-white/30 flex items-center justify-center transition-transform active:scale-95"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 4h16v12H7l-3 3V4z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="mt-3 w-[92vw] max-w-md h-[60vh] bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-r from-company-primary to-company-secondary text-white text-sm font-semibold flex items-center justify-between">
            <span>{label}</span>
            {loading ? <span className="text-white/80">Loading…</span> : null}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-white to-white/80">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm shadow ${
                    m.role === "assistant"
                      ? "bg-company-primary/10 text-company-primary border border-company-primary/20"
                      : "bg-company-secondary text-white border border-company-secondary/20"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          {!loading && allExampleQuestions.length > 0 && (
            <div className="px-3 pb-2 pt-1 bg-white/70 border-t border-white/40">
              <div className="text-xs text-gray-700 mb-1">Try asking:</div>
              <div className="flex flex-wrap gap-2">
                {allExampleQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          <form onSubmit={handleSend} className="p-2 bg-white/90 border-t border-gray-200 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-company-primary/40"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2 rounded-xl bg-company-primary hover:bg-company-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

