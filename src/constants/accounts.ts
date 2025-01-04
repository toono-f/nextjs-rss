export type Account = {
  name: string;
  username: string;
  avatar: string;
  type?: "user" | "list";
  listId?: string;
};

// 環境変数からユーザーアカウントを取得
const userAccounts =
  process.env.NEXT_PUBLIC_TWITTER_ACCOUNTS?.split(",").map((username) => ({
    type: "user" as const,
    username: username.trim(),
  })) || [];

export const accounts = [
  {
    type: "list",
    listId: "1863684093000749519",
    username: "mylist",
    avatar: "/home.svg",
  },
  ...userAccounts,
] as const;
