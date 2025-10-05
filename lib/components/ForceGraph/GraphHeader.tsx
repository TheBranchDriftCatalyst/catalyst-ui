import React from 'react';
import { useGraphConfig } from './context/GraphContext';

interface GraphHeaderProps {
  activeTab: 'filters' | 'layout' | null;
  onTabChange: (tab: 'filters' | 'layout' | null) => void;
}

const GraphHeader: React.FC<GraphHeaderProps> = ({ activeTab, onTabChange }) => {
  const config = useGraphConfig();
  const title = config.title || 'FORCE GRAPH';

  return (
    <div
      className="absolute top-0 left-0 right-0 h-16 bg-background/95 border-b-2 border-primary backdrop-blur-md z-40 flex items-center justify-between px-6 shadow-[0_4px_20px_rgba(var(--primary-rgb),0.2)]"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Title */}
      <div
        className="text-lg font-bold tracking-[3px]"
        style={{
          background: 'linear-gradient(90deg, var(--neon-pink), var(--primary), var(--neon-yellow))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(255, 0, 110, 0.3)',
        }}
      >
        {title}
      </div>

      {/* Tab Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onTabChange(activeTab === 'filters' ? null : 'filters')}
          className={`px-4 py-2 text-xs font-semibold transition-[background-color,box-shadow,border-color] duration-200 rounded-md ${
            activeTab === 'filters'
              ? 'bg-primary text-background shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]'
              : 'bg-background/50 text-foreground border border-primary/30 hover:bg-primary/10'
          }`}
        >
          ⚙️ Filters
        </button>
        <button
          onClick={() => onTabChange(activeTab === 'layout' ? null : 'layout')}
          className={`px-4 py-2 text-xs font-semibold transition-[background-color,box-shadow,border-color] duration-200 rounded-md ${
            activeTab === 'layout'
              ? 'bg-primary text-background shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]'
              : 'bg-background/50 text-foreground border border-primary/30 hover:bg-primary/10'
          }`}
        >
          📐 Layout
        </button>
      </div>
    </div>
  );
};

export default GraphHeader;
