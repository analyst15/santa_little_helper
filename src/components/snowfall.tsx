'use client';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const snowflakeCount = 100;
    const generateSnowflakes = () => {
      const newSnowflakes = Array.from({ length: snowflakeCount }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}vw`,
          animationDuration: `${Math.random() * 5 + 5}s`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random(),
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
        };
        return <div key={i} className="snowflake" style={style}></div>;
      });
      setSnowflakes(newSnowflakes);
    };

    generateSnowflakes();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {snowflakes}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) translateX(0);
          }
          100% {
            transform: translateY(110vh) translateX(10vw);
          }
        }
        .snowflake {
          position: absolute;
          top: -10vh;
          background: white;
          border-radius: 50%;
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Snowfall;
