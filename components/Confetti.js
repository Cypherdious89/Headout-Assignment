// /components/Confetti.js
import { useEffect, useState } from "react";

const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create confetti particles with purple theme
    const colors = [
      "#8000ff", // Main purple
      "#a64dff", // Light purple
      "#6500cc", // Dark purple
      "#e6d0ff", // Very light purple
      "#ff9900", // Gold accent
      "#ffcc00", // Yellow accent
      "#ff6600", // Orange accent
      "#ff3333", // Red accent
    ];

    const newParticles = [];

    for (let i = 0; i < 500; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 100,
        size: 5 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speed: 1.5 + Math.random() * 3.5,
      });
    }

    setParticles(newParticles);

    // Cleanup
    const timer = setTimeout(() => {
      setParticles([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="confetti-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: 0.7,
            animation: `fall ${particle.speed}s linear forwards`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
            zIndex: 5
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${720 + Math.random() * 720}deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
