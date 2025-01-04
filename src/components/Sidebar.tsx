"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type SidebarProps = {
  accounts: {
    username: string;
    avatar: string;
  }[];
  selectedUsername: string;
};

export default function Sidebar({ accounts, selectedUsername }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* サイドバー */}
      <div
        className={`
        fixed lg:fixed
        inset-y-0 left-0
        transform lg:transform-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        transition duration-200 ease-in-out
        w-[60px] lg:w-[72px] h-screen
        bg-[#15202b]
        flex flex-col items-center
        border-r border-gray-700
        z-30
      `}
      >
        {accounts.map((account, index) => (
          <Link
            key={index}
            href={`/?account=${account.username}`}
            onClick={() => setIsSidebarOpen(false)}
            className={`p-1.5 mt-2 rounded-full hover:bg-gray-800 transition-colors ${
              selectedUsername === account.username
                ? "ring-2 ring-blue-500"
                : ""
            }`}
          >
            <Image
              src={account.avatar}
              alt={account.username}
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
          </Link>
        ))}
      </div>

      {/* オーバーレイ */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-[#15202b]/80 backdrop-blur-sm border-b border-gray-700 p-2 flex items-center gap-4 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-800 rounded-full"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold">ホーム</h1>
      </header>
    </>
  );
}
