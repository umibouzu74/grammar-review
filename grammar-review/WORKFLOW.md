# 間違い問題 復習アプリ — 運用ワークフロー

## 全体の流れ

```
プリント写真 → Claude で誤答抽出 → JSON 出力 → questions.json に追記 → git push → 自動デプロイ
```

---

## 1. 新しい間違い問題を追加する

### Step 1: プリントの写真を撮る

生徒が解答済みのプリントをスマホで撮影し、Claudeに添付します。

### Step 2: Claude に以下のプロンプトを送る

```
添付した画像は、生徒が解答済みの英文法の問題プリントです。
間違えた問題だけを抽出し、以下のJSON形式で出力してください。
正解した問題は不要です。

出力形式:
[
  {
    "id": "セクション略称-問題番号",
    "section": "空所補充 or 適語補充 or 並べ替え",
    "japanese": "日本文",
    "english_blank": "空所付き英文",
    "correct_answer": "正答",
    "student_answer": "生徒の解答",
    "grammar_tag": "構文タグ名",
    "university": "出典大学（あれば）",
    "explanation": "なぜ間違いなのか簡潔に"
  }
]

構文タグは以下から選んでください（該当しない場合は新規作成可）:
仮定法過去, 仮定法過去完了, 仮定法未来, 仮定法倒置,
too...to構文, enough to構文, 形式主語/形式目的語,
関係代名詞what, 関係副詞where/when, such...as,
no more A than B, the＋比較級 the＋比較級, 倍数表現,
否定語文頭倒置, not...until, 二重否定,
強調構文, 使役動詞, 知覚動詞, 無生物主語構文,
動名詞の意味上の主語, be of＋名詞, the way＋S＋V,
every other, would rather A than B, be worth ～ing
```

### Step 3: JSON を questions.json にマージする

Claude が出力した JSON 配列を、`public/data/questions.json` の `questions` 配列に追加します。

```bash
# 例: Claude の出力を new_questions.json として保存した場合
# 手動で questions.json の questions 配列に追記する

# または Claude Code で:
# 「new_questions.json の内容を public/data/questions.json にマージして」
```

**注意**: `id` が重複しないように確認してください。

### Step 4: デプロイ

```bash
git add public/data/questions.json
git commit -m "Add new wrong answers from [プリント名]"
git push
# GitHub Actions で自動デプロイ、または:
npm run deploy
```

---

## 2. 初回セットアップ

### GitHub リポジトリ作成

```bash
# リポジトリを作成 (GitHub で grammar-review を作成)
cd grammar-review
git init
git remote add origin https://github.com/umibouzu74/grammar-review.git

# 依存パッケージをインストール
npm install

# 開発サーバーで確認
npm run dev

# ビルド & デプロイ
npm run build
npm run deploy
```

### GitHub Pages 設定

1. リポジトリの Settings → Pages
2. Source: `gh-pages` ブランチ
3. URL: `https://umibouzu74.github.io/grammar-review/`

### GitHub Actions（自動デプロイ、任意）

`.github/workflows/deploy.yml` を作成:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 3. QRコード共有

デプロイ後の URL:  
`https://umibouzu74.github.io/grammar-review/`

この URL で QR コードを生成して生徒に配布します。

QR コード生成ツール:
- https://qr.quel.jp/
- スマホの QR コード生成アプリ

---

## 4. 生徒ごとの進捗について

- 復習の進捗は各生徒のブラウザの localStorage に保存されます
- 生徒 A のスマホと生徒 B のスマホで進捗は独立しています
- ブラウザのデータを消去するとリセットされます

---

## 5. データファイルの構造

`public/data/questions.json`:

```json
{
  "metadata": {
    "title": "教材タイトル",
    "source": "出典",
    "student": "生徒名（任意）",
    "created": "2026-04-01",
    "total_questions": 10,
    "wrong_count": 10
  },
  "questions": [
    {
      "id": "一意のID",
      "section": "セクション名",
      "japanese": "日本文",
      "english_blank": "空所付き英文",
      "correct_answer": "正答",
      "student_answer": "生徒の解答",
      "grammar_tag": "構文タグ",
      "university": "出典大学",
      "explanation": "解説"
    }
  ]
}
```

### id の命名規則

- 空所補充: `3-01`, `3-02`, ...
- 並べ替え: `4-01`, `4-02`, ...
- 適語補充(1語): `1-01`, `1-02`, ...
- 適語補充(複数語): `2-01`, `2-02`, ...
- 別のプリントからの場合: `ch2-3-01` (第2章-セクション3-問1)

---

## 6. トラブルシューティング

| 問題 | 対処 |
|------|------|
| デプロイ後に白い画面 | `vite.config.ts` の `base` がリポジトリ名と一致しているか確認 |
| JSON 読み込みエラー | `questions.json` の構文エラーを確認（末尾カンマ等） |
| 進捗がリセットされた | ブラウザの履歴/データが消去された可能性 |
| 新しい問題が反映されない | ブラウザキャッシュをクリアするか、Ctrl+Shift+R |
