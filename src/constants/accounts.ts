export type Account = {
  name: string;
  username: string;
  avatar: string;
  type?: "user" | "list";
  listId?: string;
};

// アカウントとリストの定義
export const accounts = [
  {
    type: "list",
    listId: "1863684093000749519",
    username: "mylist", // ユニークな識別子として使用
    avatar: "/home.svg", // リスト用のアイコンを追加する必要があります
  },
  {
    type: "user",
    username: "otono_f",
  },
  {
    type: "user",
    username: "fffff3434",
  },
  {
    type: "user",
    username: "cursor_ai",
  },
  {
    type: "user",
    username: "vercel",
  },
  {
    type: "user",
    username: "micro_cms",
  },
  {
    type: "user",
    username: "uhyo_",
  },
  {
    type: "user",
    username: "catnose99",
  },

  // TODO: ユーザーを簡単に追加できるようにしたい
] as const;
