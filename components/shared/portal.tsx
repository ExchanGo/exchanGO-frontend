"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

interface PortalProps {
  children: React.ReactNode;
}

// The actual Portal component
function PortalContent({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
}

// Export a dynamically imported version that only renders on client-side
export default dynamic(() => Promise.resolve(PortalContent), {
  ssr: false, // Completely disable server-side rendering for this component
});
