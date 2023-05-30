import NextAuth, { NextAuthOptions, PagesOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserHashFromMail } from '@/utils/server/auth';

const providers = [];
if (process.env.NEXTAUTH_ENABLED === 'false') {
  providers.push(
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
      },
      async authorize(credentials: any, req: any) {
        const email = credentials.email.trim();
        const id = getUserHashFromMail(email);
        return {
          id,
          email,
        };
      },
    }),
  );
}

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
