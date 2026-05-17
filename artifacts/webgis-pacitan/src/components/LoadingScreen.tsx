import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const FACTS = [
  "Pacitan memiliki lebih dari 1001 goa alami",
  "Pantai Klayar terkenal dengan Seruling Samudra-nya",
  "Goa Gong adalah salah satu goa terindah di Asia Tenggara",
  "Pacitan adalah kota kelahiran Presiden SBY",
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [factIndex] = useState(() => Math.floor(Math.random() * FACTS.length));

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 12 + 4;
      });
    }, 120);

    const timer = setTimeout(() => {
      setProgress(100);
      setVisible(false);
      setTimeout(onComplete, 600);
    }, 2400);

    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #050e18 0%, #0a2235 40%, #0f3d5a 75%, #1a6080 100%)",
          }}
        >
          {/* Background decorative circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ width: 700, height: 700, background: "radial-gradient(circle, #38b2d8 0%, transparent 70%)" }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ width: 400, height: 400, background: "radial-gradient(circle, #f0c060 0%, transparent 70%)" }}
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-8 px-8 text-center"
          >
            {/* Logo icon */}
            <div className="relative">
              <div
                className="w-28 h-28 rounded-[2rem] flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(56,178,216,0.25), rgba(56,178,216,0.08))",
                  border: "1px solid rgba(56,178,216,0.3)",
                  boxShadow: "0 0 60px rgba(56,178,216,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <svg width="58" height="58" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26 4C14.954 4 6 12.954 6 24C6 30.627 9.278 36.497 14.35 40.15L26 48L37.65 40.15C42.722 36.497 46 30.627 46 24C46 12.954 37.046 4 26 4Z" fill="#38b2d8" opacity="0.95"/>
                  <path d="M26 14C20.477 14 16 18.477 16 24C16 29.523 20.477 34 26 34C31.523 34 36 29.523 36 24C36 18.477 31.523 14 26 14Z" fill="white" opacity="0.9"/>
                  <path d="M26 20C23.791 20 22 21.791 22 24C22 26.209 23.791 28 26 28C28.209 28 30 26.209 30 24C30 21.791 28.209 20 26 20Z" fill="#0a2235"/>
                </svg>
              </div>
              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-[2rem]"
                style={{
                  border: "2px solid transparent",
                  borderTopColor: "#38b2d8",
                  borderRightColor: "transparent",
                  borderBottomColor: "#f0c060",
                  borderLeftColor: "transparent",
                }}
              />
            </div>

            {/* Title */}
            <div>
              <h1
                className="text-5xl font-bold text-white mb-2"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: "-0.02em",
                  textShadow: "0 4px 24px rgba(56,178,216,0.25)",
                }}
              >
                WebGIS Pacitan
              </h1>
              <p
                className="text-lg font-medium"
                style={{ color: "#93d5ed", letterSpacing: "0.06em", fontFamily: "'Inter', sans-serif" }}
              >
                KOTA 1001 GOA
              </p>
            </div>

            {/* Fun fact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="max-w-xs px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(56,178,216,0.08)",
                border: "1px solid rgba(56,178,216,0.2)",
              }}
            >
              <p className="text-xs font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                💡 {FACTS[factIndex]}
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-64 flex flex-col items-center gap-2">
              <div
                className="w-full h-1 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #38b2d8, #f0c060)",
                    width: `${Math.min(progress, 100)}%`,
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                Memuat peta...
              </p>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-6 text-xs"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif" }}
          >
            Kabupaten Pacitan, Jawa Timur · 7°01'S 111°06'E
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
