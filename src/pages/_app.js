import "../styles/globals.css";
import ClientLayout from "../layouts/clientDashLayout";
import AdminLayout from "../layouts/adminDashLayout";
import MainLayout from "../layouts/mainLayout";
import { registerLicense } from "@syncfusion/ej2/base.js";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { AuthProvider } from "../contexts/auth";
import withAuth from "../hocs/withAuth";

const ContextProvider = dynamic(() => import("../contexts/ContextProvider"), {
  ssr: false,
});

registerLicense(
  "ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5QdUVjX35cdHZRRmVe"
);

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isClientRoute = router.pathname.startsWith("/dashboard");
  const isAdminRoute = router.pathname.startsWith("/admin/dashboard");
  const ProtectedComponent = isClientRoute || isAdminRoute ? withAuth(Component) : Component;


  const Layout = isAdminRoute ? AdminLayout : isClientRoute ? ClientLayout : MainLayout;
  return (
    <ContextProvider>
      <AuthProvider>
      <Layout>
        <ProtectedComponent {...pageProps}/>
      </Layout>
      </AuthProvider>
    </ContextProvider>
  );
}