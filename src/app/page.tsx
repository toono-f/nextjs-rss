import Image from "next/image";
import parse from "html-react-parser";
import { accounts } from "@/constants/accounts";

type Author = {
  name: string;
  url: string;
  avatar: string;
};

type TweetItem = {
  id: string;
  url: string;
  title: string;
  content_html: string;
  date_published: string;
  authors: Author[];
};

async function getTweets(username: string) {
  const url = `http://localhost:1200/twitter/user/${username}?format=json`;
  // 開発環境だけログを出す
  if (process.env.NODE_ENV === "development") console.log(url);

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch tweets");
  }
  const jsonData = await res.json();

  // リプライを除外（content_htmlに"Re @"が含まれているものを除外）
  const filteredItems: TweetItem[] = jsonData.items.filter(
    (item: TweetItem) => !item.content_html.includes("Re @")
  );

  return {
    items: filteredItems,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { account?: string };
}) {
  // デフォルトのアカウントまたは選択されたアカウント
  const selectedUsername = searchParams.account || accounts[0].username;
  const tweets = await getTweets(selectedUsername);

  return (
    <div className="min-h-screen bg-[#15202b] text-white">
      <div className="flex">
        {/* サイドバー */}
        <div className="w-[68px] lg:w-[88px] h-screen sticky top-0 flex flex-col items-center border-r border-gray-700">
          {accounts.map((account, index) => (
            <a
              key={index}
              href={`/?account=${account.username}`}
              className={`p-2 mt-2 rounded-full hover:bg-gray-800 transition-colors ${
                selectedUsername === account.username
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
              <Image
                src={account.avatar}
                alt={account.name}
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
            </a>
          ))}
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          <div className="max-w-2xl mx-auto">
            {/* ヘッダー部分 */}
            <header className="sticky top-0 z-10 bg-[#15202b]/80 backdrop-blur-sm border-b border-gray-700 p-4">
              <h1 className="text-xl font-bold">ホーム</h1>
            </header>

            {/* ツイート一覧 */}
            <main className="divide-y divide-gray-700">
              {tweets.items?.map((tweet: TweetItem) => (
                <a
                  key={tweet.id}
                  href={tweet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 hover:bg-gray-900 transition-colors block"
                >
                  <div className="flex gap-3">
                    {/* プロフィール画像 */}
                    <div className="flex-shrink-0">
                      <Image
                        src={tweet.authors[0].avatar}
                        alt="Profile Icon"
                        className="w-12 h-12 rounded-full"
                        width={48}
                        height={48}
                      />
                    </div>

                    {/* ツイート本文 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">
                          {tweet.authors[0].name}
                        </span>
                        <span className="text-gray-500">
                          @{extractUsername(tweet.authors[0].url)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(tweet.date_published)}
                        </span>
                      </div>
                      <div className="text-sm">{parse(tweet.content_html)}</div>
                    </div>
                  </div>
                </a>
              ))}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

// 日付フォーマット用の関数を追加
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month}月${day}日 ${hours}:${minutes}`;
}

// ユーザー名を抽出する関数を追加
function extractUsername(url: string): string {
  return url.replace("https://x.com/", "");
}
