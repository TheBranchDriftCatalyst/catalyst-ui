import React, { useState, useCallback, ReactNode } from "react";
import { CardContext, CardComponent } from "./CardContext";

/**
 * Card provider component - manages dynamic card header/footer content
 *
 * @param props - Component props
 * @param props.children - Child components to render
 *
 * @remarks
 * This provider enables components to dynamically register content
 * for card headers and footers. Common use cases:
 * - Breadcrumb navigation in headers
 * - Action buttons in footers
 * - Status indicators
 * - Pagination controls
 *
 * Components register themselves on mount and automatically unregister
 * on unmount. Multiple components can register simultaneously and will
 * be rendered in registration order.
 *
 * **Architecture:**
 * 1. Child components call `useCardHeader()` or `useCardFooter()`
 * 2. Components are added to internal state arrays
 * 3. Card container renders all registered components
 * 4. Cleanup functions auto-remove components on unmount
 *
 * @example Basic Setup
 * ```tsx
 * // App.tsx
 * import { CardProvider } from '@/catalyst-ui/contexts/Card';
 *
 * function App() {
 *   return (
 *     <CardProvider>
 *       <Card>
 *         <CardHeader /> {/* Renders registered header components *\/}
 *         <CardContent>
 *           <MyComponent /> {/* Can use useCardHeader/Footer *\/}
 *         </CardContent>
 *         <CardFooter /> {/* Renders registered footer components *\/}
 *       </Card>
 *     </CardProvider>
 *   );
 * }
 * ```
 *
 * @example Card Container
 * ```tsx
 * import { useCard } from '@/catalyst-ui/contexts/Card';
 *
 * function Card({ children }) {
 *   const { headerComponents, footerComponents } = useCard();
 *
 *   return (
 *     <div className="card">
 *       {headerComponents.length > 0 && (
 *         <div className="card-header">
 *           {headerComponents.map((comp, i) => (
 *             <div key={i}>{comp}</div>
 *           ))}
 *         </div>
 *       )}
 *       <div className="card-content">{children}</div>
 *       {footerComponents.length > 0 && (
 *         <div className="card-footer">
 *           {footerComponents.map((comp, i) => (
 *             <div key={i}>{comp}</div>
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Consumer Components
 * ```tsx
 * import { useCardHeader, useCardFooter } from '@/catalyst-ui/contexts/Card';
 * import { useEffect } from 'react';
 *
 * function FormWithActions() {
 *   // Register breadcrumbs in header
 *   const cleanupHeader = useCardHeader(
 *     <nav>Home / Forms / Edit</nav>
 *   );
 *
 *   // Register action buttons in footer
 *   const cleanupFooter = useCardFooter(
 *     <div>
 *       <button>Cancel</button>
 *       <button>Save</button>
 *     </div>
 *   );
 *
 *   // Cleanup on unmount
 *   useEffect(() => {
 *     return () => {
 *       cleanupHeader();
 *       cleanupFooter();
 *     };
 *   }, []);
 *
 *   return <form>...</form>;
 * }
 * ```
 *
 * @public
 */
export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [headerComponents, setHeaderComponents] = useState<CardComponent[]>([]);
  const [footerComponents, setFooterComponents] = useState<CardComponent[]>([]);

  const registerHeaderComponent = useCallback((component: CardComponent) => {
    setHeaderComponents(prev => [...prev, component]);

    // Return cleanup function
    return () => {
      setHeaderComponents(prev => prev.filter(c => c !== component));
    };
  }, []);

  const registerFooterComponent = useCallback((component: CardComponent) => {
    setFooterComponents(prev => [...prev, component]);

    // Return cleanup function
    return () => {
      setFooterComponents(prev => prev.filter(c => c !== component));
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
