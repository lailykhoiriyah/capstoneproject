import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/db";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  httpOptions: {
    timeout: 10000,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const { email, name, image, id: googleId } = user;
        
        try {
          // Use upsert to create or update user in one go
          const { error: upsertError } = await supabase
            .from('users')
            .upsert(
              { 
                google_id: googleId, 
                name, 
                email, 
                avatar_url: image,
                // We don't set id here, let Supabase handle it if new
              }, 
              { onConflict: 'email' }
            );
          
          if (upsertError) {
            console.error("Error syncing user to Supabase:", upsertError);
            // Even if sync fails, we might want to let them in, 
            // but for safety during dev, let's log it.
          }
          return true;
        } catch (error) {
          console.error("Auth logic error:", error);
          return true; // Let them sign in anyway
        }
      }
      return true;
    },
    async session({ session, token }) {
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (userData) {
          session.user.id = userData.id;
        }
      } catch (error) {
        console.error("Error fetching user session from Supabase:", error);
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
