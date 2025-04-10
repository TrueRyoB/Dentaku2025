const maxResults = 3;
let previousResult = '';
let previousFormula = '';

document.getElementById("formula-field").addEventListener("keydown", function (event) {
  if (event.keyCode === 32 || event.key === "Space" || event.key === " ") {
      alert("space is detected");
      event.preventDefault();
      const value = document.getElementById("formula-field").value;
      if (previousResult !== '' && typeof value === "string" && value.trim() === "") {
          document.getElementById("formula-field").value = previousResult;
      }
  }
  else if (event.key === "Enter") 
  {
    event.preventDefault();
    readFormulaField();
  }
  else if (event.key === "Tab")
  {
    alert("tab is detected");
    event.preventDefault();
    const value = document.getElementById("formula-field").value;
    if(previousFormula !== '' && typeof value == "string" && value.trim() === "")
    {
      document.getElementById("formula-field").value = previousFormula;
    }
  }
});


// When a calculation form is submitted
document.getElementById("submit").addEventListener("click", function () {
  readFormulaField();
});

// When results' elements are clicked
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

// When a tweet button is clicked
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

// Apply a player input
function readFormulaField() {
  const value = document.getElementById("formula-field").value;
  
  if (typeof value !== "string") 
  {
    alert("The given value is not a string: " + value);
    return;
  }

  previousFormula = value;
  document.getElementById("formula-field").value = "";

  const result = parseAndEvaluate(value);
  if (!result.success)
  {
    alert("The given value contains invalid words: " + value);
    return;
  }
  const resultsArea = document.getElementById("results-area");
  previousResult = result.value;

  const newResult = document.createElement("div");
  const timestamp = getCurrentTimestamp();
  newResult.textContent = `📌${value} = ${result.value} (${timestamp})`;
  newResult.className = "result-item";

  if (resultsArea.children.length >= maxResults) resultsArea.removeChild(resultsArea.lastChild);

  resultsArea.prepend(newResult);
}
