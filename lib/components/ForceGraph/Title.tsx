import React from "react";
import { useGraphConfig } from "./context/GraphContext";

const Title: React.FC = () => {
  const config = useGraphConfig();
  const title = config.title || "FORCE GRAPH";

  return (
    <div
      className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xl font-bold tracking-[5px]"
      style={{
        background: "linear-gradient(90deg, var(--neon-pink), var(--primary), var(--neon-yellow))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0 0 30px rgba(255, 0, 110, 0.5)",
      }}
    >
      {title}
    </div>
  );
};

export default Title;
