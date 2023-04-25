import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import * as jwt from 'jsonwebtoken';
const jwt_decode = jwt.decode;

export default function AdminDashboarding() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt_decode(token);
    console.log(decoded);
    if(decoded.type !== "admin"){
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } catch (err) {
    console.log("Error decoding JWT: ", err);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
