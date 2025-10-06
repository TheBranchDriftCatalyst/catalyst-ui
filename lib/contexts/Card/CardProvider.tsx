import React, { useState, useCallback, ReactNode } from "react";
import { CardContext, CardComponent } from "./CardContext";

export const CardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [headerComponents, setHeaderComponents] = useState<CardComponent[]>(
    []
  );
  const [footerComponents, setFooterComponents] = useState<CardComponent[]>(
    []
  );

  const registerHeaderComponent = useCallback((component: CardComponent) => {
    setHeaderComponents((prev) => [...prev, component]);

    // Return cleanup function
    return () => {
      setHeaderComponents((prev) =>
        prev.filter((c) => c !== component)
      );
    };
  }, []);

  const registerFooterComponent = useCallback((component: CardComponent) => {
    setFooterComponents((prev) => [...prev, component]);

    // Return cleanup function
    return () => {
      setFooterComponents((prev) =>
        prev.filter((c) => c !== component)
      );
    };
  }, []);

  return (
    <CardContext.Provider
      value={{
        headerComponents,
        footerComponents,
        registerHeaderComponent,
        registerFooterComponent,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};
