"use client";
import Debug from "debug";
import React, { ReactNode, createContext, useContext, useState } from "react";

// Type for the context value
interface DebuggerContextType {
  getDebugger: (namespace: string) => Debug.Debugger;
  debuggers: Record<string, Debug.Debugger>;
}

// Create the context with default values (the defaults will be overridden by Provider)
export const DebuggerContext = createContext<DebuggerContextType>({
  getDebugger: (namespace: string) => Debug(namespace),
  debuggers: {},
});

// Define the provider props type
interface DebuggerProviderProps {
  children: ReactNode;
}

// DebuggerProvider component
export const DebuggerProvider: React.FC<DebuggerProviderProps> = ({
  children,
}) => {
  // State to store cached debuggers
  const [debuggers, setDebuggers] = useState<Record<string, Debug.Debugger>>(
    {},
  );

  const getDebugger = (namespace: string): Debug.Debugger => {
    // Check if the debugger already exists, if not create a new one and cache it
    if (!debuggers[namespace]) {
      const newDebugger = Debug(namespace);
      setDebuggers((prev) => ({ ...prev, [namespace]: newDebugger }));
      return newDebugger;
    }
    return debuggers[namespace];
  };

  return (
    <DebuggerContext.Provider value={{ getDebugger, debuggers }}>
      {children}
    </DebuggerContext.Provider>
  );
};

// Custom hook to use the debugger
export const useDebugger = (namespace: string): Debug.Debugger => {
  const context = useContext(DebuggerContext);
  if (!context) {
    throw new Error("useDebugger must be used within a DebuggerProvider");
  }
  return context.getDebugger(namespace);
};
