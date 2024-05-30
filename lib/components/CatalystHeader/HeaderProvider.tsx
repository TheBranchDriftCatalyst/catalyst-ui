import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

type HeaderComponent = ReactNode;
interface Breadcrumb {
  label: string;
  path?: string;
}

interface HeaderContextType {
  headerComponents: HeaderComponent[];
  breadcrumbs: Breadcrumb[];
  pageTitle: string;
  registerHeaderComponent: (component: HeaderComponent) => void;
  deregisterHeaderComponent: (component: HeaderComponent) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  setPageTitle: (title: string) => void;
}

const defaultContext: HeaderContextType = {
  headerComponents: [],
  breadcrumbs: [],
  pageTitle: "",
  registerHeaderComponent: () => {},
  deregisterHeaderComponent: () => {},
  setBreadcrumbs: () => {},
  setPageTitle: () => {},
};

const HeaderContext = createContext<HeaderContextType>(defaultContext);

export const useHeader = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [headerComponents, setHeaderComponents] = useState<HeaderComponent[]>(
    [],
  );
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [pageTitle, setPageTitle] = useState<string>("");

  const registerHeaderComponent = useCallback((component: HeaderComponent) => {
    setHeaderComponents((prevComponents) => [...prevComponents, component]);
  }, []);

  const deregisterHeaderComponent = useCallback(
    (component: HeaderComponent) => {
      setHeaderComponents((prevComponents) =>
        prevComponents.filter((c) => c !== component),
      );
    },
    [],
  );

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
