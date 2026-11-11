# Haruhiko Yoshioka’s Homepage

[日本語](https://hy20191108.github.io/) · [English](https://hy20191108.github.io/en/) · [llms.txt](https://hy20191108.github.io/llms.txt)

## プロフィールを更新する

- 氏名・所属・連絡先は [`_data/profile.yml`](_data/profile.yml) を編集する。
- 研究・業績・経歴は [`_includes/profile-ja.md`](_includes/profile-ja.md) と [`_includes/profile-en.md`](_includes/profile-en.md) を編集する。
- HTML と Markdown は同じ本文から生成する。`index.md` と `en/index.md` は HTML の入口、同じ場所の `index.txt` は公開 URL `/index.md` と `/en/index.md` を生成する入口である。

## ローカルで確認する

Dockerを起動し，actでGitHub Actionsと同じビルドジョブをコンテナ内で実行する．ホストへのRuby・Node.js・Bunのインストールは不要．

```sh
act pull_request
```

`.actrc`で`browser`ジョブと，その前提となる`build`ジョブを実行する．ビルドはUbuntu 24.04，ブラウザ検証はPlaywright公式コンテナを使う．生成物はactのローカル成果物サーバーを通じて受け渡し，GitHubへの公開は行わない．Dockerの接続先は`DOCKER_HOST`で指定できる．

`build`ジョブでは，整形，Markdown，SCSS，Ruby，Jekyllビルド，生成物の受入確認，HTML構文を確認する．`browser`ジョブでは，その生成物をChromiumで開き，コピーとMarkdown表示を確認する．日本語・英語，スマートフォン幅，コピーに失敗した場合，JavaScriptを無効にした場合を対象にする．ブラウザと必要なライブラリは公式イメージに含まれる．

JavaScriptの依存関係は`bun.lock`で固定し，CIでは`bun install --frozen-lockfile`でインストールする．Bunのバージョンは`package.json`の`packageManager`を参照する．

実行環境を用意済みの場合は，`bun run check`と`bun run test:browser`を個別に実行できる．ブラウザテストは生成済みの`_site`を静的サーバーで配信し，終了時にサーバーを停止する．自動修正には`bun run format`と`bundle exec standardrb --fix`を使う．

SCSS の本体は `_sass/` に置く。`styles.scss` は Jekyll の front matter と読み込み宣言だけを持つ。Ruby Sass との互換性のため、色関数とメディアクエリは従来構文に固定する。Markdown の行折り返しは Prettier に任せ、HTML を含むテンプレートの構文は生成後にも検査する。

HTML 検査は正しい構造を担当し、整形はソースの Prettier が担当する。Jekyll が生成する空白・空要素の記法、HTML で有効な脚注 ID、表の配置と色見本に必要なインライン指定を許容する。CI では actionlint によるワークフローの構文検査も必須にする。

## 公開する

`master` への push 後、GitHub Actions が全検査を実行する。ビルドとブラウザ検証の両方が成功した `_site` だけを GitHub Pages に配備する。Pull Request では同じ検査を実行し、配備は行わない。公開結果は Actions の実行結果と冒頭の公開 URL で確認する。

情報の正本を共有して複数の表示を生成する構成は、Agile Modeling の [Single Source Information](https://agilemodeling.com/essays/singlesourceinformation.htm) に沿う。公開条件は [Executable Specifications](https://agilemodeling.com/essays/executablespecifications.htm) の考え方に沿って受入検査と CI に置く。
