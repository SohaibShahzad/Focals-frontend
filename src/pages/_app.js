import "../styles/globals.css";
import DashboardLayout from "../layouts/dashboardLayout";
import MainLayout from "../layouts/mainLayout";
import TestMainLayout from "../layouts/testMainLayout";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { AuthProvider } from "../contexts/auth";
import withAuth from "../hocs/withAuth";
import { parseCookies } from "nookies";
import * as jwt from "jsonwebtoken";
import {SessionProvider} from "next-auth/react";
const jwt_decode = jwt.decode;

const ContextProvider = dynamic(() => import("../contexts/ContextProvider"), {
  ssr: false,
});

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const is404Route = router.pathname.endsWith("/404");
  const isClientRoute = router.pathname.startsWith("/dashboard");
  const isAdminRoute = router.pathname.startsWith("/adminFocals/dashboard");
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

  const userType = isAdminRoute ? 'admin' : isClientRoute ? 'client' : 'subadmin';

  const Layout = isAdminRoute || isClientRoute || isSubAdminRoute
  ? (props) => <DashboardLayout {...props} userType={userType} />
  : is404Route
  ? (props) => <TestMainLayout {...props} />
  : (props) => <MainLayout {...props} />;

  return (
    <ContextProvider>
      <AuthProvider>
        <SessionProvider session={session}>
          <Layout role={role}>
            <ProtectedComponent {...pageProps} />
          </Layout>
        </SessionProvider>
      </AuthProvider>
    </ContextProvider>
  );
}
