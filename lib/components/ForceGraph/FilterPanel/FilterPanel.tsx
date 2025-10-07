import React from "react";
import { FilterPanelProps } from "../types/filterTypes";
import FilterPanelTabs from "./FilterPanelTabs";

const FilterPanel: React.FC<FilterPanelProps> = ({ isVisible, onToggle }) => {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-[98px] w-10 h-10 bg-background/95 border-2 border-primary rounded-full text-primary cursor-pointer flex items-center justify-center transition-all duration-300 z-[1001] shadow-[0_4px_20px_rgba(var(--primary-rgb),0.3)] backdrop-blur-[10px] hover:shadow-[0_6px_30px_rgba(var(--primary-rgb),0.5)] hover:bg-background hover:scale-110 active:scale-95"
        style={{
          right: isVisible ? "312px" : "16px",
        }}
        title="Toggle Filters"
      >
        <span
          className="text-base transition-transform duration-300"
          style={{
            display: "inline-block",
            transform: isVisible ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ⚙️
        </span>
      </button>

      {/* Panel */}
      <div
        className="fixed top-[72px] w-[300px] h-[calc(100vh-120px)] bg-background/98 backdrop-blur-[20px] border-2 border-primary border-t-0 border-b-0 text-foreground p-3 overflow-y-auto z-[1000] shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] transition-transform duration-500 ease-in-out"
        style={{
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          right: 0,
        }}
      >
        <h3
          className="mb-3 text-sm font-bold text-primary tracking-wide uppercase animate-[fade-in_0.3s_ease-out] [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]"
          style={{ textShadow: "0 0 12px var(--primary)" }}
        >
          Graph Controls
        </h3>

        <div className="animate-[fade-in_0.3s_ease-out] [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
          <FilterPanelTabs />
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
