import { useEffect, useState } from "react";

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
        console.error(`Failed to load icon: ${iconName}`, err);
        // @ts-ignore
        setError(err);
      }
    };

    importIcon();
  }, [iconName]);

  return { IconComponent, error };
};

export default useDynamicImport;
