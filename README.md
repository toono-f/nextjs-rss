## 環境変数の設定

```bash
cp .env.example .env
```

```env
DEBUG_INFO=false
DISALLOW_ROBOT=true

TWITTER_USERNAME=ユーザーネーム
TWITTER_PASSWORD=パスワード
TWITTER_COOKIE=auth_token=Xのauth_token; ct0=Xのct0
```

## RSSHubの起動

```bash
docker compose up -d
```

## アカウント・リストの追加

`src/constants/accounts.ts` に追加してください。

## ローカルで起動

```bash
npm run dev
```

## RSSHubの停止

```bash
docker compose down
```