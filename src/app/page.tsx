import Image from "next/image";

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

// フェッチ関数を非同期で定義
async function getTweets() {
  const res = await fetch(
    "http://localhost:1200/twitter/user/otono_f?format=json"
  );
  if (!res.ok) {
    throw new Error("Failed to fetch tweets");
  }
  const jsonData = await res.json();

  // リプライを除外（content_htmlに"Re @"が含まれているものを除外）
  const filteredItems = jsonData.items.filter(
    (item: TweetItem) => !item.content_html.includes("Re @")
  );

  // データを整形
  return {
    items: filteredItems.map((item: TweetItem) => ({
      id: item.id,
      content: item.content_html.replace(/<[^>]*>/g, ""),
      date: new Date(item.date_published).toLocaleDateString("ja-JP"),
      link: item.url,
      iconUrl: item.authors[0].avatar.replace("_normal", ""), // 高解像度の画像を使用
    })),
  };
}

type Tweet = {
  id: string;
  content?: string;
  date: string;
  link: string;
  iconUrl: string;
};

export default async function Home() {
  const tweets = await getTweets();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー部分 */}
        <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-700 p-4">
          <h1 className="text-xl font-bold">ホーム</h1>
        </header>

        {/* ツイート一覧 */}
        <main className="divide-y divide-gray-700">
          {tweets.items?.map((tweet: Tweet) => (
            <article
              key={tweet.id}
              className="p-4 hover:bg-gray-900 transition-colors"
            >
              <div className="flex gap-3">
                {/* プロフィール画像 */}
                <div className="flex-shrink-0">
                  <Image
                    src={tweet.iconUrl}
                    alt="Profile Icon"
                    className="w-12 h-12 rounded-full"
                    width={48}
                    height={48}
                  />
                </div>

                {/* ツイート本文 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">おとの</span>
                    <span className="text-gray-500">@otono_f</span>
                  </div>
                  <p className="text-sm">{tweet.content}</p>

                  {/* インタラクションボタン */}
                  <div className="flex justify-between mt-3 max-w-md text-gray-500">
                    <button className="hover:text-blue-400">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </span>
                    </button>
                    <button className="hover:text-green-400">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </span>
                    </button>
                    <button className="hover:text-pink-400">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </span>
                    </button>
                    <button className="hover:text-blue-400">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}
