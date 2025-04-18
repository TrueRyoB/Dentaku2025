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
