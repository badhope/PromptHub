declare module 'next-auth' {
  interface User {
    role?: string;
    developerMode?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      developerMode?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    developerMode?: boolean;
  }
}
