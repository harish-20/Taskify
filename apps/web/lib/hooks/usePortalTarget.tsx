import { useEffect, useState } from "react";

const usePortalTarget: (elementId: string) => Element | null = (elementId) => {
  const [mounted, setMounted] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    setElement(document.querySelector(`#${elementId}`));
    setMounted(true);
  }, [elementId]);

  if (!mounted || !element) return null;

  return element;
};

export default usePortalTarget;
