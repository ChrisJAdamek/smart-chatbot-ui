// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserHashFromMail } from '@/utils/server/auth';

const providers = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'text', placeholder: 'example@example.com' },
    },
async authorize(credentials, req) {
  if (!credentials || !credentials.email) {
    throw new Error('Missing credentials');
  }

  const email = credentials.email.trim();
  const id = getUserHashFromMail(email);
  return {
    id,
    email,
  };
},

  }),
];

let pages: Partial<PagesOptions> = {};

if (process.env.NEXTAUTH_ENABLED === 'false') {
  pages['signIn'] = '/auth/autologin';
}

export const authOptions: NextAuthOptions = {
  providers: providers,
  session: { strategy: 'jwt' },
  pages,
};

export default NextAuth(authOptions);
