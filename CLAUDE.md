# Project Notes

## 業績情報の参照先

不足情報補完用のリソース一覧：

| リソース | URL | アクセス方法 | 用途 | robots.txt |
|---------|-----|------------|------|-----------|
| 嶋利一真 HP | https://k-shimari.github.io/index.ja.html | WebFetch | 共著者業績確認 | なし ✓ |
| 上野研 PMAN | https://pman.uwanolab.jp/pman3.cgi | WebFetch | 業績検索・BibTeX出力 | なし ✓ |
| NAIST SE研 業績 | https://naist-se.github.io/en/publish/ | playwright-cli | 研究室業績一覧 | なし ✓ |
| NAISTAR OAI-PMH | https://naist.repo.nii.ac.jp/oai | OAI-PMH | メタデータ抽出（推奨） | 許可 ✓ |
| NAISTAR 検索UI | https://naist.repo.nii.ac.jp/search | playwright-cli | 全文検索（JS必須） | 許可 ✓ |
| AI-Driven SE Summit | https://posl.ait.kyushu-u.ac.jp/~aidriven2025/ | WebFetch | イベント情報 | なし ✓ |

## 外部API利用の意思決定フロー

| シナリオ | 推奨リソース | 理由 |
|---------|-----------|------|
| 著者名で全業績抽出 | PMAN BibTeX (`?A=yoshioka&MODE=bbl`) | 統一フォーマット、サーバーサイド生成 |
| DOI/詳細情報が必要 | PMAN 個別ページ (`?D=xxx`) | BibTeX出力ではDOI/URLが省略される |
| NAIST限定情報取得 | NAISTAR OAI-PMH | 標準プロトコル、robots.txt許可 |
| JS動的ページ | playwright-cli スキル | WebFetchでは結果取得不可 |

## PMAN 仕様メモ (v3.2.10)

ベースURL: `https://pman.uwanolab.jp/pman3.cgi`

### 主要パラメータ

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| `D` | 論文ID指定（個別ページ） | `?D=250` |
| `A` | 著者名検索 | `?A=yoshioka` |
| `T` | タグ検索 (AND/OR) | `?T=eye` |
| `MODE` | 出力形式: `list`, `table`, `latex`, `bbl` | `?MODE=bbl` |
| `LANG` | 言語: `ja`, `en` | `?LANG=en` |
| `PTYPE` | 出版物タイプ: `all`, 著書, 論文誌, 国際会議 等 | `?PTYPE=all` |
| `SORT` | ソート順（年月昇順/降順） | |
| `MENU` | `simple` / `detail`（詳細検索） | `?MENU=detail` |
| `STATIC` | 静的HTMLを生成 | |

### 組み合わせ例

- 著者でBibTeX出力: `?A=yoshioka&MODE=bbl`
- 個別エントリ詳細: `?D=230` (DOI, ページ番号等が記載)
- 英語表示: `?A=yoshioka&LANG=en`

### 注意事項

- サーバーサイド生成のためJS不要、WebFetchで読み取り可能
- DOI等は個別ページ (`?D=xxx`) にのみ掲載される場合がある
- BibTeX一括出力ではDOI/URLが省略されることがある

## NAISTAR 仕様メモ (WEKO3ベース)

ベースURL: `https://naist.repo.nii.ac.jp/`

### OAI-PMH (推奨)

機関リポジトリの標準公開プロトコル。外部からのメタデータ取得はこちらを使う。

- エンドポイント: `https://naist.repo.nii.ac.jp/oai`
- 例: `?verb=Identify`, `?verb=ListRecords&metadataPrefix=oai_dc`
- DOI、著者、タイトル等のメタデータを取得可能

### REST API (非推奨)

- `/api/records/?q=...` でJSON応答が得られるが、robots.txtで `/api/` が Disallow
- 外部向け公開ポリシーの明示なし。利用は避ける

### 検索UI

- `/search?q=...` はJS動的レンダリングのためWebFetchでは結果取得不可
- WebFetch/WebSearch で記事本文が取得できない場合は **playwright-cli スキル**でブラウザ経由で取得する

## 外部リソースアクセス ポリシー確認済み

**確認日**: 2026-02-09

| サイト | robots.txt | 状況 |
|--------|-----------|------|
| 嶋利HP | 存在しない | 制限なし ✓ |
| PMAN | 存在しない | 制限なし ✓ |
| NAIST SE研 | 存在しない | 制限なし ✓ |
| NAISTAR | 存在する | `/api/` Disallow ✗、`/oai` 許可 ✓ |
| AI-Driven Summit | 存在しない | 制限なし ✓ |
