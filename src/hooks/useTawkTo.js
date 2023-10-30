import { useEffect } from "react";

const useTawkTo = (tawkToKey) => {
  useEffect(() => {
    // Function to initialize Tawk.to
    const startTawkTo = () => {
      if (!window.Tawk_API) {
        const tawkToScript = document.createElement("script");
        tawkToScript.type = "text/javascript";
        tawkToScript.async = true;
        tawkToScript.src = `https://embed.tawk.to/${tawkToKey}/1h31ada2k`;
        tawkToScript.charset = "UTF-8";
        tawkToScript.setAttribute("crossorigin", "*");
        document.body.appendChild(tawkToScript);
      }
    };

    // Load Tawk.to script
    startTawkTo();

    // Cleanup function to remove the script
    return () => {
      const tawkToScript = document.querySelector(
        `script[src*="${tawkToKey}"]`
      );
      if (tawkToScript) {
        tawkToScript.remove();
      }
    };
  }, [tawkToKey]);
};

export default useTawkTo;
