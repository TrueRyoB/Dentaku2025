const maxResults = 5;

document.getElementById("submit").addEventListener("click", function () {
  const value = document.getElementById("formula-field").value;
  
  if (typeof value !== "string") 
  {
    alert("The given value is not a string: " + value);
    return;
  }

  const result = parseAndEvaluate(value);
  if (!result.success)
  {
    alert("The given value contains invalid words: " + value);
    return;
  }

  const resultsArea = document.getElementById("results-area");

  const newResult = document.createElement("div");
  newResult.textContent = `📌${value} = ${result.value} (${getCurrentTimestamp()})`;
  newResult.className = "result-item";

  if (resultsArea.children.length >= maxResults) resultsArea.removeChild(resultsArea.firstChild);

  resultsArea.prepend(newResult);
});

document.getElementById("results-area").addEventListener("click", function (event) {
  if (event.target && event.target.tagName === "DIV") {
    const formula = event.target.textContent.split(' = ')[0]; // 数式部分を抽出

    navigator.clipboard.writeText(formula).then(() => {
      alert(`数式 "${formula}" をコピーしました！`);
    }).catch(err => {
      console.error("コピー失敗:", err);
    });
  }
});

//let n = value.length;//if (/\d/.test(c)) 

document.getElementById("reportBtn").addEventListener("click", function () {
  const text = encodeURIComponent("#2025電卓　(開発者はこのタグを不定期に検索することでデバッグに取り掛かります！)");
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(url, "_blank");
});

// Parse equations and return the value (and action status)
function parseAndEvaluate(expr) {
  if (!/^[0-9+\-*/. ]+$/.test(expr))  return { success: false };

  try {
    let result = eval(expr);
    return { success: true, value: result };
  } catch (e) {
    return { success: false };
  }
}

// Get a string representing a timestamp (self-explanatory tho)
function getCurrentTimestamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
