# はじめに
このレポジトリは投稿者の就活の一環で作りました。電卓の機能性を備えたwebサイトとなります。<br>
勿論オープンソースなので、好きなコード自由につまんでいって構いませんが、機能性はとても限定されています...<br>
以下は担当者様への指示になります。<br>

# 提出物確認方法
課題1:<br>
[このレポジトリ](https://github.com/TrueRyoB/Nangokusoft-assignment-1/tree/main)で設計を確認できます。<br>
[このサイト](https://trueryob.github.io/Nangokusoft-assignment-1/)で実際に稼働しています。<br>
操作方法・機能性は[このページ](https://x.com/deep_nap_engine/status/1911382531712098813)にて紹介・更新していきます。<br>
<br>
他の課題：<br>
ビルドの都合上、リポジトリを分けました。[こちら](https://github.com/TrueRyoB/Nangokusoft-assignment-other/blob/main/README.md)にて詳細をご確認ください。<br>

# 問題
現状、以下のtest caseを突破できていません。括弧をつけてあげたら動作します。<br>
sinπ + 1 = 1<br>
atantan1, 1 = 1<br>
atanatan1, 1, π/4 = π/4<br>

# 伸び代
地域化対応<br>
testcaseを全て突破できるよう修繕<br>
txtファイルによる入力/出力に対応<br>
パイプライン演算子に対応<br>
広告などの掲載<br>
一日一問等のイベント作成<br>
操作方法紹介ページ解説<br>
数式有効活用の例紹介ページ解説<br>



問題：
・JetBrainsがcsファイルのエラーを検出してくれなくなった。

判明していること：
・JetBrainsというText Editorを用いていること
・Dotnetっていう開発環境を使っていること
・dotnet new console -o RapidDebug
・dotnet new slnの後にdotnet sln add RapidDebug.csprojを用いたこと
・同ディレクトリ内のcsprojectファイルはいつも通り読み取れているらしい


憶測
・通常Unityなどでは動いているため、恐らく対象がC#ファイルだと認識できていない
