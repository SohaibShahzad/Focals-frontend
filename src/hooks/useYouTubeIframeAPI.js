import { useEffect } from "react";

const useYoutubeIframeAPI = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${process.env.NEXT_PUBLIC_SERVER_URL}api/youtube-proxy`; // Change the URL to the new proxy route
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
};
export default useYoutubeIframeAPI;
