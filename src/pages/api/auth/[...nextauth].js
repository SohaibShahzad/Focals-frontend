import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from "axios"

export const authOptions = {
  
 providers: [
  GoogleProvider({
   clientId: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
 ],
 session: {
  strategy: 'jwt',
 },
 callbacks: {
  async signIn(token) {
    var profile  = token.profile;
    if (profile) {
      // Define the user data to be sent to the backend
      const userData = {
        firstName: profile.given_name,
        lastName: profile.family_name,
        username: profile.email,
        googleId: profile.sub,
      };

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
  async session(session) {
    return session;
  }
}
}
export default NextAuth(authOptions);
