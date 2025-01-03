import Image from "next/image";
import parse from "html-react-parser";

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

async function getTweets() {
  const res = await fetch(
    "http://localhost:1200/twitter/user/otono_f?format=json"
  );
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
          {tweets.items?.map((tweet: TweetItem) => (
            <article
              key={tweet.id}
              className="p-4 hover:bg-gray-900 transition-colors"
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
                    <span className="font-bold">{tweet.authors[0].name}</span>
                    <span className="text-gray-500">
                      @{tweet.authors[0].url}
                    </span>
                  </div>
                  <p className="text-sm">{parse(tweet.content_html)}</p>
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}
