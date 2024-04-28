import { createHash } from "crypto";
import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from ".";


export interface Session {
  user: {
    email: string;
    id: string;
    name: string;
    image?: string;
  };
}

export const getSession = async () => {
  return getServerSession(NextAuthOptions) as Promise<Session>;
};

export const hashToken = (
  token: string,
  {
    noSecret = false,
  }: {
    noSecret?: boolean;
  } = {},
) => {
  return createHash("sha256")
    .update(`${token}${noSecret ? "" : process.env.NEXTAUTH_SECRET}`)
    .digest("hex");
};
