import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

/**
 * Represents a React component or element to be displayed in the header
 */
type HeaderComponent = ReactNode;

/**
 * Represents a single breadcrumb item in the navigation trail
 *
 * @interface Breadcrumb
 */
interface Breadcrumb {
  /** Display text for the breadcrumb */
  label: string;
  /** Optional URL path for navigation */
  path?: string;
}

/**
 * Shape of the HeaderContext value provided to consuming components
 *
 * This context allows child components to dynamically register themselves
 * in the header, manage breadcrumbs, and control the page title.
 *
 * @interface HeaderContextType
 */
interface HeaderContextType {
  /** Array of React components currently registered in the header */
  headerComponents: HeaderComponent[];

  /** Current breadcrumb navigation trail */
  breadcrumbs: Breadcrumb[];

  /** Current page title */
  pageTitle: string;

  /**
   * Register a component to be displayed in the header
   *
   * Components can call this from useEffect to add themselves to the header.
   * Returns the component to the list when the effect runs.
   *
   * @param component - React component or element to register
   *
   * @example
   * ```tsx
   * const MyComponent = () => {
   *   const { registerHeaderComponent, deregisterHeaderComponent } = useHeader();
   *
   *   useEffect(() => {
   *     const button = <Button>Action</Button>;
   *     registerHeaderComponent(button);
   *     return () => deregisterHeaderComponent(button);
   *   }, []);
   *
   *   return <div>Content</div>;
   * };
   * ```
   */
  registerHeaderComponent: (component: HeaderComponent) => void;

  /**
   * Remove a component from the header
   *
   * Should be called in useEffect cleanup to remove the component when unmounting
   *
   * @param component - React component or element to remove
   */
  deregisterHeaderComponent: (component: HeaderComponent) => void;

  /**
   * Update the breadcrumb navigation trail
   *
   * @param breadcrumbs - New breadcrumb array
   *
   * @example
   * ```tsx
   * setBreadcrumbs([
   *   { label: "Home", path: "/" },
   *   { label: "Products", path: "/products" },
   *   { label: "Laptops" } // Current page, no path
   * ]);
   * ```
   */
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;

  /**
   * Update the page title
   *
   * @param title - New page title string
   *
   * @example
   * ```tsx
   * setPageTitle("Dashboard - My App");
   * ```
   */
  setPageTitle: (title: string) => void;
}

/**
 * Default context value with no-op functions
 * Used as fallback if context is consumed outside provider
 */
const defaultContext: HeaderContextType = {
  headerComponents: [],
  breadcrumbs: [],
  pageTitle: "",
  registerHeaderComponent: () => {},
  deregisterHeaderComponent: () => {},
  setBreadcrumbs: () => {},
  setPageTitle: () => {},
};

/**
 * React context for header state management
 * @internal
 */
const HeaderContext = createContext<HeaderContextType>(defaultContext);

/**
 * Hook to access the HeaderContext
 *
 * Provides access to header state and methods for managing header components,
 * breadcrumbs, and page title. Must be used within a HeaderProvider.
 *
 * @throws {Error} If used outside of HeaderProvider
 * @returns HeaderContextType object with state and methods
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   const { setPageTitle, setBreadcrumbs } = useHeader();
 *
 *   useEffect(() => {
 *     setPageTitle("My Page");
 *     setBreadcrumbs([
 *       { label: "Home", path: "/" },
 *       { label: "My Page" }
 *     ]);
 *   }, []);
 *
 *   return <div>Page content</div>;
 * }
 * ```
 */
export const useHeader = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};

/**
 * HeaderProvider - Context provider for dynamic header management
 *
 * Provides a context for managing header state across the application, including:
 * - Dynamic header component registration
 * - Breadcrumb navigation
 * - Page title management
 *
 * Child components can register themselves in the header using the `useHeader` hook
 * and calling `registerHeaderComponent` in a useEffect. This allows for dynamic,
 * contextual header content that changes based on the active page or component.
 *
 * @param props - Component props
 * @param props.children - Child components to wrap with HeaderProvider
 * @returns Provider component wrapping children
 *
 * @example
 * Basic usage:
 * ```tsx
 * function App() {
 *   return (
 *     <HeaderProvider>
 *       <CatalystHeader title="My App" />
 *       <Routes>
 *         <Route path="/" element={<HomePage />} />
 *       </Routes>
 *     </HeaderProvider>
 *   );
 * }
 * ```
 *
 * @example
 * Component registering itself in header:
 * ```tsx
 * function SettingsPage() {
 *   const { registerHeaderComponent, deregisterHeaderComponent, setPageTitle } = useHeader();
 *
 *   useEffect(() => {
 *     setPageTitle("Settings");
 *
 *     const saveButton = (
 *       <Button onClick={handleSave}>
 *         Save Changes
 *       </Button>
 *     );
 *
 *     registerHeaderComponent(saveButton);
 *     return () => deregisterHeaderComponent(saveButton);
 *   }, []);
 *
 *   return <div>Settings content...</div>;
 * }
 * ```
 */
export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [headerComponents, setHeaderComponents] = useState<HeaderComponent[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [pageTitle, setPageTitle] = useState<string>("");

  const registerHeaderComponent = useCallback((component: HeaderComponent) => {
    setHeaderComponents(prevComponents => [...prevComponents, component]);
  }, []);

  const deregisterHeaderComponent = useCallback((component: HeaderComponent) => {
    setHeaderComponents(prevComponents => prevComponents.filter(c => c !== component));
  }, []);

  return (
    <HeaderContext.Provider
      value={{
        headerComponents,
        breadcrumbs,
        pageTitle,
        registerHeaderComponent,
        deregisterHeaderComponent,
        setBreadcrumbs,
        setPageTitle,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
