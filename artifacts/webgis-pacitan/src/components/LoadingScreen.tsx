import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 600);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0a3348 0%, #0f4c6b 50%, #1a6a8a 100%)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center"
                   style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26 4C14.954 4 6 12.954 6 24C6 30.627 9.278 36.497 14.35 40.15L26 48L37.65 40.15C42.722 36.497 46 30.627 46 24C46 12.954 37.046 4 26 4Z" fill="#38b2d8" opacity="0.9"/>
                  <path d="M26 14C20.477 14 16 18.477 16 24C16 29.523 20.477 34 26 34C31.523 34 36 29.523 36 24C36 18.477 31.523 14 26 14Z" fill="white" opacity="0.9"/>
                  <path d="M26 20C23.791 20 22 21.791 22 24C22 26.209 23.791 28 26 28C28.209 28 30 26.209 30 24C30 21.791 28.209 20 26 20Z" fill="#0f4c6b"/>
                </svg>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{ border: "3px solid transparent", borderTopColor: "#38b2d8", borderRightColor: "#f0c060" }}
              />
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold text-white tracking-tight mb-1">WebGIS Pacitan</h1>
              <p className="text-lg font-medium" style={{ color: "#93d5ed" }}>Kota 1001 Goa</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#38b2d8" }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>Memuat peta...</p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 text-xs text-center"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Kabupaten Pacitan, Jawa Timur — 7°01'S 111°06'E
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
