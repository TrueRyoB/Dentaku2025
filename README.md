# はじめに
このレポジトリは投稿者の就活の一環で作りました。電卓の機能性を備えたwebサイトとなります。<br>
勿論オープンソースなので、好きなコード自由につまんでいって構いませんが、機能性はとても限定されています...<br>
以下は担当者様への指示になります。<br>

# 提出物確認方法
課題1:<br>
このレポジトリで設計を確認できます。<br>
[このサイト](https://trueryob.github.io/Nangokusoft-assignment-1/)で実際に稼働しています。<br>
<br>
他の課題：<br>
ビルドの都合上、リポジトリを分けました。[こちら](https://github.com/TrueRyoB/Nangokusoft-assignment-other/blob/main/README.md)にて詳細をご確認ください。

# 戦略
Djikstra発案のShunting Yardアルゴリズムを用いて数式をparseします。<br>
1. StringをExpressionに変換する(の際にエラー判定その1を遂行) <br>
2. ExpressionをPostfix notationに変換する <br>
3. Mapを元に数式を処理する<br>
この3段階を経ます。<br>
