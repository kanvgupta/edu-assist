import NextAuth, { type NextAuthOptions, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db"; // Import the Prisma client we created
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

// Extend the User type to include hashedPassword
interface DbUser extends User {
  hashedPassword?: string | null;
}

// Define the select type
const userSelect = {
  id: true,
  email: true,
  name: true,
  hashedPassword: true,
} satisfies Prisma.UserSelect;

export const authOptions: NextAuthOptions = {
  // Remove or comment out adapter when using JWT strategy with CredentialsProvider
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          console.error("Auth Error: Missing email or password");
          return null;
        }

        const user = (await prisma.user.findUnique({
          where: { email: credentials.email },
        })) as DbUser | null;

        if (!user?.hashedPassword) {
          console.error(
            `Auth Error: No user found for email ${credentials.email}`
          );
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isValidPassword) {
          console.error(
            `Auth Error: Invalid password for user ${credentials.email}`
          );
          return null;
        }

        // Return user without the password hash
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Change to JWT strategy
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login", // Redirect users to /login if they are not signed in
    // error: '/auth/error', // Optional: custom error page
  },
  callbacks: {
    // JWT Callback - Called whenever a JWT is created or updated
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    // Session Callback - Called whenever a session is checked
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  // Add secret for production
  secret: process.env.NEXTAUTH_SECRET,
  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
