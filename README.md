# Haruhiko Yoshioka’s Homepage

[日本語](https://hy20191108.github.io/) · [English](https://hy20191108.github.io/en/) · [llms.txt](https://hy20191108.github.io/llms.txt)

## プロフィールを更新する

- 氏名・所属・連絡先は [`_data/profile.yml`](_data/profile.yml) を編集する。
- 研究・業績・経歴は [`_includes/profile-ja.md`](_includes/profile-ja.md) と [`_includes/profile-en.md`](_includes/profile-en.md) を編集する。
- HTML と Markdown は同じ本文から生成する。`index.md` と `en/index.md` は HTML の入口、同じ場所の `index.txt` は公開 URL `/index.md` と `/en/index.md` を生成する入口である。

## ローカルで確認する

CI と同じ Ruby 3.3.4、Bundler 2.5.11、Node.js 24 を使用する。

```sh
bundle install
npm ci
npm run format
bundle exec standardrb --fix
npm run check
bundle exec jekyll serve
```

`npm run check` は整形、Markdown、SCSS、Ruby、Jekyll ビルド、生成物の受入検査、HTML 構文を順に検査する。自動修正は `npm run format` と `bundle exec standardrb --fix`、SCSS の自動修正は `npx stylelint '_sass/**/*.scss' --fix` で行う。

SCSS の本体は `_sass/` に置く。`styles.scss` は Jekyll の front matter と読み込み宣言だけを持つ。Ruby Sass との互換性のため、色関数とメディアクエリは従来構文に固定する。Markdown の行折り返しは Prettier に任せ、HTML を含むテンプレートの構文は生成後にも検査する。

HTML 検査は正しい構造を担当し、整形はソースの Prettier が担当する。Jekyll が生成する空白・空要素の記法、HTML で有効な脚注 ID、表の配置と色見本に必要なインライン指定を許容する。CI では actionlint によるワークフローの構文検査も必須にする。

## 公開する

`master` への push 後、GitHub Actions が全検査を実行する。成功した `_site` だけを GitHub Pages に配備する。Pull Request では同じ検査を実行し、配備は行わない。公開結果は Actions の実行結果と冒頭の公開 URL で確認する。

情報の正本を共有して複数の表示を生成する構成は、Agile Modeling の [Single Source Information](https://agilemodeling.com/essays/singlesourceinformation.htm) に沿う。公開条件は [Executable Specifications](https://agilemodeling.com/essays/executablespecifications.htm) の考え方に沿って受入検査と CI に置く。
