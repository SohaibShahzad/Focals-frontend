import "../styles/globals.css";
import ClientLayout from "../layouts/clientLayout";
import AdminLayout from "../layouts/adminLayout";
import { registerLicense } from "@syncfusion/ej2/base.js";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAuthenticated } from "../lib/auth";

const ContextProvider = dynamic(() => import("../contexts/ContextProvider"), {
  ssr: false,
});

registerLicense(
  "ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5QdUVjX35cdHZRRmVe"
);

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isRoute = router.pathname.startsWith("/dashboards");

  useEffect(() => {
    if (isRoute && !isAuthenticated()) {
      router.push("/login-register");
    }
  }, [router]);

  const getLayout =
    Component.getLayout || ((page) => <ClientLayout children={page} />);

  const Layout = isRoute ? AdminLayout : ClientLayout;
  return (
    <ContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ContextProvider>
  );
}
