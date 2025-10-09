import { useEffect, useState } from "react";
import { createLogger } from "@/catalyst-ui/utils/logger";

const log = createLogger("useDynamicImport");

const useDynamicImport = (iconName: string) => {
  const [IconComponent, setIconComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const importIcon = async () => {
      try {
        const module = await import(
          `node_modules/@icons-pack/react-simple-icons/icons/${iconName}`
        );
        setIconComponent(() => module.default);
      } catch (err) {
        log.error(`Failed to load icon: ${iconName}`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    importIcon();
  }, [iconName]);

  return { IconComponent, error };
};

export default useDynamicImport;
