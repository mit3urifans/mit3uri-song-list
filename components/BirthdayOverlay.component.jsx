import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function BirthdayOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let intervalId;

    const duration = 4000;
    const end = Date.now() + duration;

    const launchConfetti = () => {
      // Confetti from the left
      confetti({
        particleCount: 50,
        startVelocity: 45,
        spread: 60,
        angle: 60,
        origin: { x: 0, y: 0.6 },
      });

      // Confetti from the right
      confetti({
        particleCount: 50,
        startVelocity: 45,
        spread: 60,
        angle: 120,
        origin: { x: 1, y: 0.6 },
      });

      if (Date.now() < end) {
        intervalId = window.setTimeout(launchConfetti, 300);
      }
    };

    launchConfetti();

    const timeout = window.setTimeout(() => setVisible(false), 5000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(intervalId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="text-center px-4">
        <h1 className="text-[4vw] font-extrabold text-pink-600 drop-shadow-lg animate-bounce mb-4">
          🎉 三理Mit3uri生日快乐！🎂
        </h1>
      </div>
    </div>
  );
}