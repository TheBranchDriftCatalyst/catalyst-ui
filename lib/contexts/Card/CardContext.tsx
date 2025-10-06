import { createContext, useContext, ReactNode } from "react";

export type CardComponent = ReactNode;

export interface CardContextType {
  headerComponents: CardComponent[];
  footerComponents: CardComponent[];
  registerHeaderComponent: (component: CardComponent) => () => void;
  registerFooterComponent: (component: CardComponent) => () => void;
}

const defaultContext: CardContextType = {
  headerComponents: [],
  footerComponents: [],
  registerHeaderComponent: () => () => {},
  registerFooterComponent: () => () => {},
};

export const CardContext = createContext<CardContextType>(defaultContext);

export const useCard = (): CardContextType => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCard must be used within a CardProvider");
  }
  return context;
};

/**
 * Hook to register a component in the card header
 * Returns cleanup function automatically called on unmount
 */
export const useCardHeader = (component: CardComponent) => {
  const { registerHeaderComponent } = useCard();
  return registerHeaderComponent(component);
};

/**
 * Hook to register a component in the card footer
 * Returns cleanup function automatically called on unmount
 */
export const useCardFooter = (component: CardComponent) => {
  const { registerFooterComponent } = useCard();
  return registerFooterComponent(component);
};
