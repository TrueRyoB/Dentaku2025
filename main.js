const maxResults = 10;
const saveKey = "history";

let previousResult = '';
let previousFormula = '';
let arrRes = [];
let arrIndex = 0;

// For debugging
window.addEventListener("load", () => {
  const storedVersion = localStorage.getItem("appVersion");

  if (storedVersion === null || storedVersion !== currentVersion) {
    alert(`New JS file of "${currentVersion}" is loaded!`);
    localStorage.setItem("appVersion", currentVersion);
  }
});

document.addEventListener("keydown", function(event) {
  const isBodyFocused = document.activeElement === document.body;

  if (isBodyFocused && event.key === "Tab") {
    event.preventDefault();
    document.getElementById("formula-field").focus();
  }
});

document.getElementById("formula-field").addEventListener("keydown", function (event) {
  if (event.key === "Space" || event.key === " ") {

      const value = document.getElementById("formula-field").value;
      if (previousResult !== '' && typeof value === "string" && value.trim() === "") {
          event.preventDefault();
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
    event.preventDefault();
    const value = document.getElementById("formula-field").value;
    if(previousFormula !== '' && typeof value == "string" && value.trim() === "")
    {
      document.getElementById("formula-field").value = previousFormula;
    }
  }
  else if (["I", "i"].includes(event.key)) {
    const input = document.getElementById("formula-field");

    const cursorPos = input.selectionStart;
    const value = input.value;
    
    const last = value.slice(0, cursorPos).slice(-1);

    if (["p", "P"].includes(last)) {
      event.preventDefault();
      input.value = value.slice(0, cursorPos - 1) + "π" + value.slice(cursorPos);
      input.setSelectionRange(cursorPos, cursorPos);
    }
  }
});


// When a calculation form is submitted
document.getElementById("submit").addEventListener("click", async function () {
  await readFormulaField();
});

// When results' elements are clicked
document.getElementById("results-area").addEventListener("click", function (event) {
  if (event.target && event.target.className === "result-item") {
    
    const positionalIndex = Array.from(document.getElementById("results-area").children).indexOf(event.target);

    const index = (arrIndex - positionalIndex + maxResults) % maxResults;
    
    const formula = arrRes[index];

    navigator.clipboard.writeText(formula).then(() => {
      alert(`"${formula}" をクリップボードにコピーしました`);
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
  const formulaRaw = document.getElementById("formula-field").value;
  
  if (typeof formulaRaw !== "string") 
  {
    alert("The given value is not a string: " + value);
    return;
  }

  const solution = window.parseLib.parse(formulaRaw);
  
  if (solution.success !== ParseStatus.SUCCESS)
  {
    alert("Error occured: " + solution.success);
    return;
  }
  document.getElementById("formula-field").value = "";
  
  const resultsArea = document.getElementById("results-area");
  previousResult = solution.value;

  const newResult = document.createElement("div");
  const timestamp = getCurrentTimestamp();
  newResult.textContent = `📌${formulaRaw} = ${solution.value} (${timestamp})`;
  newResult.className = "result-item";

  if (resultsArea.children.length >= maxResults) 
  {
    resultsArea.removeChild(resultsArea.lastChild);
  }

  const formulaToBeCopied = `${formulaRaw} = ${solution.value}`;
  
  let urlStr = "";
  for(let i=0; i < maxResults; ++i) {
    const ele = arrRes[(arrIndex+i)%maxResults];
    if (ele != null) urlStr += ele;
  }
  saveToHash(saveKey, urlStr);

  resultsArea.prepend(newResult);
  arrIndex = (arrIndex + maxResults + 1) % maxResults;
  arrRes[arrIndex] = formulaToBeCopied;
  previousFormula = formulaRaw;
}

function loadFromHash(key) {
  const hashParams = new URLSearchParams(location.hash.slice(1));
  return hashParams.get(key);
}

function saveToHash(key, value) {
  const hashParams = new URLSearchParams(location.hash.slice(1));
  hashParams.set(key, value);
  location.hash = hashParams.toString();
}
