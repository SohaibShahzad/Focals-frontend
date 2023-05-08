// hooks/useTawkTo.js
import { useEffect } from "react";

const useTawkTo = () => {
  useEffect(() => {
    const smartsuppScript = document.createElement("script");
    smartsuppScript.type = "text/javascript";
    smartsuppScript.async = true;
    smartsuppScript.src = "https://www.smartsuppchat.com/loader.js?";
    smartsuppScript.charset = "utf-8";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(smartsuppScript, firstScript);

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = "40b35cf5de75f86fce1f64d5c804df59aabc88f0";

    return () => {
      smartsuppScript.remove();
    };
  }, []);

};

export default useTawkTo;
