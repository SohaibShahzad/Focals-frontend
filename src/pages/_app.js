import "../styles/globals.css";
import ClientLayout from "../layouts/clientDashLayout";
import AdminLayout from "../layouts/adminDashLayout";
import SubAdminLayout from "../layouts/subAdminDashLayout";
import MainLayout from "../layouts/mainLayout";
import TestMainLayout from "../layouts/testMainLayout";
import { registerLicense } from "@syncfusion/ej2/base.js";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { AuthProvider } from "../contexts/auth";
import withAuth from "../hocs/withAuth";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
const jwt_decode = jwt.decode;

const ContextProvider = dynamic(() => import("../contexts/ContextProvider"), {
  ssr: false,
});

registerLicense(
  "ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5QdUVjX35cdHZRRmVe"
);

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const is404Route = router.pathname.endsWith("/404");
  const isClientRoute = router.pathname.startsWith("/dashboard");
  const isAdminRoute = router.pathname.startsWith("/admin/dashboard");
  const isSubAdminRoute = router.pathname.startsWith("/subadmin/dashboard");
  const ProtectedComponent =
    isClientRoute || isAdminRoute || isSubAdminRoute
      ? withAuth(Component)
      : Component;

  let role = [];
  if (isSubAdminRoute) {
    const cookies = parseCookies();
    const token = cookies["token"];
    if (token) {
      const decodedToken = jwt_decode(token);
      role = decodedToken.role[0];
    }
  }

  const Layout = isAdminRoute
    ? (props) => <AdminLayout {...props} />
    : isClientRoute
    ? (props) => <ClientLayout {...props} />
    : isSubAdminRoute
    ? (props) => <SubAdminLayout {...props} />
    : is404Route
    ? (props) => <TestMainLayout {...props} />
    : (props) => <MainLayout {...props} />;

  return (
    <ContextProvider>
      <AuthProvider>
        <Layout role={role}>
          <ProtectedComponent {...pageProps} />
        </Layout>
      </AuthProvider>
    </ContextProvider>
  );
}
