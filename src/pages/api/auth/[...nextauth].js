// import NextAuth from "next-auth/next";
// import GoogleProvider from "next-auth/providers/google";
// import axios from "axios";
// import { setCookie } from "nookies";

// const props = {
//   signup: false,
//   signin: true,
// };

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   pages: {
//     signIn: "/",
//     error: `/login?prop=${encodeURIComponent(JSON.stringify(props))}`,
//   },
//   jwt: {
//     secret: process.env.JWT_SECRET,

//   },
//   callbacks: {
//     async signIn({ account, user, profile }) {
//       if (account.provider === "google") {
//         const userData = {
//           firstName: profile.given_name,
//           lastName: profile.family_name,
//           username: profile.email,
//           googleId: user.id,
//         };

//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_SERVER_URL}users/saveGoogleUser`,
//           userData
//         );
//         console.log(response);
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//         if (response.status === 200) {
//           setCookie(null, "token", response.data.token, {
//             maxAge: 30 * 24 * 60 * 60,
//             path: "/",
//           });
//           console.log("setting user cookie");
//           setCookie(null, "user", JSON.stringify(response.data.user), {
//             maxAge: 30 * 24 * 60 * 60,
//             path: "/",
//           });
//         } else {
//           throw new Error("Error saving user");
//         }
//       }
//       return true;
//     },
//   },
// });

// import NextAuth from "next-auth/next";
// import GoogleProvider from "next-auth/providers/google";
// import axios from "axios";

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   pages: {
//     signIn: "/",
//     error: `/login?prop=${encodeURIComponent(JSON.stringify({ signup: false, signin: true }))}`,
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//     setOptions: {
//       httpOnly: false,
//       path: "/",
//     }
//   },
//   jwt: {
//     secret: process.env.JWT_SECRET,
//   },
//   callbacks: {
//     async jwt(token, user) {
//       // Check if it's the sign-in process by verifying if the user object exists
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//         token.token = user.token;  // Storing the token from backend in the JWT
//       }
//       return token;
//     },
//     async signIn({ account, user, profile }) {
//       if (account.provider === "google") {
//         const userData = {
//           firstName: profile.given_name,
//           lastName: profile.family_name,
//           username: profile.email,
//           googleId: user.id,
//         };

//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_SERVER_URL}users/saveGoogleUser`,
//           userData
//         );

//         if (response.status === 200) {
//           console.log(response.data);
//           user.id = response.data.user._id;  // Assuming the MongoDB model's default field name for ID is _id
//           user.email = profile.email;
//           user.name = `${profile.given_name} ${profile.family_name}`;
//           user.token = response.data.token;  // Adding the token from backend to the user object
//         } else {
//           throw new Error("Error saving user");
//         }
//       }
//       return true;
//     },
//   },
// });

// import NextAuth from "next-auth/next";
// import GoogleProvider from "next-auth/providers/google";
// import axios from "axios";

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async jwt(token, user, account, profile) {
//       if (account && user) {
//         const userData = {
//           firstName: profile.given_name,
//           lastName: profile.family_name,
//           username: profile.email,
//           googleId: user.id,
//         };
//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_SERVER_URL}users/saveGoogleUser`,
//           userData
//         );
//         token = {
//           ...token,
//           ...response.data
//         };
//       }
//       return token;
//     },
//     async session(session, token) {
//       return {
//         ...session,
//         ...token
//       };
//     },
//   },
// });

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (user) {
        token = {
          ...token,
          name: user.name,
          email: user.email,
          picture: user.image,
        };

        // Define the user data to be sent to the backend
        const userData = {
          firstName: profile.given_name,
          lastName: profile.family_name,
          username: profile.email,
          googleId: profile.sub,
        };

        // Send a POST request to the backend to save the user
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}users/saveGoogleUser`,
            userData
          );
          console.log("User saved to backend:", response.data);
        } catch (error) {
          console.error("Error saving user to backend:", error);
        }
      }
      return token;
    },
    async session(session, token) {
      console.log({ session, token });
      session.user = {
        ...session.user,
        name: token.name,
        email: token.email,
        picture: token.picture,
      };
      return session;
    },
  },
});