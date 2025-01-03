import Image from "next/image";
import parse from "html-react-parser";
import { accounts } from "@/constants/accounts";
import Sidebar from "@/components/Sidebar";
import CopyButton from "@/components/CopyButton";

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

async function fetchData(account: (typeof accounts)[number]) {
  const baseUrl = `${process.env.BASE_URL}/twitter/`;

  const option =
    "/readable&includeRts=false&excludeReplies=true&&showEmojiForRetweetAndReply=true&addLinkForPics=true&showQuotedAuthorAvatarInDesc=true&format=json";

  const url =
    account.type === "list"
      ? `${baseUrl}list/${account.listId}${option}`
      : `${baseUrl}user/${account.username}${option}`;

  if (process.env.NODE_ENV === "development") console.log(url);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch data for ${account.username}`);
  const data = await res.json();

  // アカウント情報を抽出
  const accountInfo =
    account.type === "list"
      ? {
          name: account.username,
          username: account.username,
          avatar: account.avatar,
          type: account.type,
          listId: account.listId,
        }
      : {
          name: data.items[0].authors[0].name,
          username: account.username,
          avatar: data.items[0].authors[0].avatar,
          type: account.type,
        };

  return {
    accountInfo,
    tweets: data,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { account?: string };
}) {
  const params = await searchParams;
  const selectedUsername = params.account || accounts[0].username;

  // すべてのアカウントのデータを並行して取得
  const allAccountsData = await Promise.all(
    accounts.map((account) => fetchData(account))
  );

  // アカウント情報の配列を作成
  const accountInfos = allAccountsData.map((data) => data.accountInfo);

  // 選択されたアカウントのツイートを取得
  const tweets = allAccountsData.find(
    (data) => data.accountInfo.username === selectedUsername
  )?.tweets || { items: [] };

  return (
    <div className="min-h-screen bg-[#15202b] text-white">
      <div className="flex">
        <Sidebar accounts={accountInfos} selectedUsername={selectedUsername} />

        {/* メインコンテンツ */}
        <div className="flex-1 lg:ml-0 mt-16 lg:mt-0">
          <div className="max-w-2xl mx-auto">
            {/* PCのヘッダー */}
            <header className="hidden lg:block sticky top-0 z-10 bg-[#15202b]/80 backdrop-blur-sm border-b border-gray-700 p-4">
              <h1 className="text-xl font-bold">ホーム</h1>
            </header>

            {/* ツイート一覧 */}
            <main className="divide-y divide-gray-700">
              {tweets.items?.map((tweet: TweetItem) => (
                <div key={tweet.id} className="pt-4 px-4 pb-2">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Image
                        src={tweet.authors[0].avatar}
                        alt="Profile Icon"
                        className="w-10 h-10 rounded-full"
                        width={40}
                        height={40}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <a
                          href={tweet.authors[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold truncate max-w-[120px] text-sm hover:underline hover:text-blue-400"
                        >
                          {tweet.authors[0].name}
                        </a>
                        <a
                          href={tweet.authors[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 text-sm hover:underline hover:text-blue-400 truncate max-w-[100px]"
                        >
                          @{extractUsername(tweet.authors[0].url)}
                        </a>
                        <a
                          href={tweet.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 text-sm hover:underline hover:text-blue-400 truncate max-w-[100px]"
                        >
                          {formatDate(tweet.date_published)}
                        </a>
                      </div>
                      <div className="text-sm tweet-content group relative pb-8">
                        {parse(tweet.content_html)}
                        <CopyButton url={tweet.url} />
                      </div>
                    </div>
                  </div>
                </div>
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
