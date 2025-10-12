import { createContext, useContext, ReactNode } from "react";

/**
 * Type alias for card component slots (header/footer)
 * Can be any valid React node
 * @public
 */
export type CardComponent = ReactNode;

/**
 * Card context shape for dynamic card content management
 *
 * @remarks
 * Provides a registry system for components to dynamically inject
 * content into card headers and footers. Useful for:
 * - Breadcrumbs in card headers
 * - Action buttons in card footers
 * - Status indicators in headers
 * - Pagination controls in footers
 *
 * Components register themselves on mount and automatically
 * unregister on unmount via cleanup functions.
 *
 * @public
 */
export interface CardContextType {
  /**
   * Array of components registered for the card header
   * Rendered in registration order
   */
  headerComponents: CardComponent[];

  /**
   * Array of components registered for the card footer
   * Rendered in registration order
   */
  footerComponents: CardComponent[];

  /**
   * Register a component to appear in the card header
   * @param component - React component or node to render
   * @returns Cleanup function to unregister (called on unmount)
   */
  registerHeaderComponent: (component: CardComponent) => () => void;

  /**
   * Register a component to appear in the card footer
   * @param component - React component or node to render
   * @returns Cleanup function to unregister (called on unmount)
   */
  registerFooterComponent: (component: CardComponent) => () => void;
}

/**
 * Default context value (no-op functions)
 * @internal
 */
const defaultContext: CardContextType = {
  headerComponents: [],
  footerComponents: [],
  registerHeaderComponent: () => () => {},
  registerFooterComponent: () => () => {},
};

/**
 * React context for card content management
 *
 * @remarks
 * This context should be consumed via:
 * - {@link useCard} - Access full context
 * - {@link useCardHeader} - Register header component
 * - {@link useCardFooter} - Register footer component
 *
 * Do not use `useContext(CardContext)` directly.
 *
 * @public
 */
export const CardContext = createContext<CardContextType>(defaultContext);

/**
 * Hook to access card context
 *
 * @returns CardContextType with registration functions and component arrays
 *
 * @remarks
 * Must be used within a {@link CardProvider}
 *
 * Use this hook when you need full access to the card context.
 * For simpler registration, use {@link useCardHeader} or {@link useCardFooter}.
 *
 * @example Access Header Components
 * ```tsx
 * import { useCard } from '@/catalyst-ui/contexts/Card';
 *
 * function CardHeader() {
 *   const { headerComponents } = useCard();
 *
 *   return (
 *     <div className="card-header">
 *       {headerComponents.map((comp, i) => (
 *         <div key={i}>{comp}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Manual Registration
 * ```tsx
 * import { useCard } from '@/catalyst-ui/contexts/Card';
 * import { useEffect } from 'react';
 *
 * function MyComponent() {
 *   const { registerHeaderComponent } = useCard();
 *
 *   useEffect(() => {
 *     const cleanup = registerHeaderComponent(<span>My Header</span>);
 *     return cleanup; // Unregister on unmount
 *   }, []);
 *
 *   return <div>...</div>;
 * }
 * ```
 *
 * @public
 */
export const useCard = (): CardContextType => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCard must be used within a CardProvider");
  }
  return context;
};

/**
 * Hook to register a component in the card header
 *
 * @param component - React component or node to render in header
 * @returns Cleanup function (automatically called on unmount)
 *
 * @remarks
 * Must be used within a {@link CardProvider}
 *
 * The component is registered on mount and automatically unregistered
 * on unmount. Multiple components can be registered and will be
 * rendered in registration order.
 *
 * @example Simple Usage
 * ```tsx
 * import { useCardHeader } from '@/catalyst-ui/contexts/Card';
 * import { useEffect } from 'react';
 *
 * function Breadcrumbs() {
 *   const cleanup = useCardHeader(
 *     <nav>Home / Products / Details</nav>
 *   );
 *
 *   useEffect(() => cleanup, []); // Cleanup on unmount
 *
 *   return <div>Main content...</div>;
 * }
 * ```
 *
 * @example With State
 * ```tsx
 * import { useCardHeader } from '@/catalyst-ui/contexts/Card';
 * import { useEffect, useState } from 'react';
 *
 * function DynamicHeader() {
 *   const [count, setCount] = useState(0);
 *
 *   const cleanup = useCardHeader(
 *     <div>
 *       <span>Count: {count}</span>
 *       <button onClick={() => setCount(c => c + 1)}>+</button>
 *     </div>
 *   );
 *
 *   useEffect(() => cleanup, [count]); // Re-register when count changes
 *
 *   return <div>Main content...</div>;
 * }
 * ```
 *
 * @public
 */
export const useCardHeader = (component: CardComponent) => {
  const { registerHeaderComponent } = useCard();
  return registerHeaderComponent(component);
};

/**
 * Hook to register a component in the card footer
 *
 * @param component - React component or node to render in footer
 * @returns Cleanup function (automatically called on unmount)
 *
 * @remarks
 * Must be used within a {@link CardProvider}
 *
 * The component is registered on mount and automatically unregistered
 * on unmount. Multiple components can be registered and will be
 * rendered in registration order.
 *
 * @example Action Buttons
 * ```tsx
 * import { useCardFooter } from '@/catalyst-ui/contexts/Card';
 * import { useEffect } from 'react';
 *
 * function FormActions() {
 *   const cleanup = useCardFooter(
 *     <div>
 *       <button>Cancel</button>
 *       <button>Save</button>
 *     </div>
 *   );
 *
 *   useEffect(() => cleanup, []);
 *
 *   return <form>...</form>;
 * }
 * ```
 *
 * @example Pagination
 * ```tsx
 * import { useCardFooter } from '@/catalyst-ui/contexts/Card';
 * import { useEffect, useState } from 'react';
 *
 * function DataTable() {
 *   const [page, setPage] = useState(1);
 *
 *   const cleanup = useCardFooter(
 *     <div>
 *       <button onClick={() => setPage(p => p - 1)}>Prev</button>
 *       <span>Page {page}</span>
 *       <button onClick={() => setPage(p => p + 1)}>Next</button>
 *     </div>
 *   );
 *
 *   useEffect(() => cleanup, [page]);
 *
 *   return <table>...</table>;
 * }
 * ```
 *
 * @public
 */
export const useCardFooter = (component: CardComponent) => {
  const { registerFooterComponent } = useCard();
  return registerFooterComponent(component);
};
