const maxResults = 10;
const saveKey = "formulas";
const borderChar = ";";

let previousResult = '';
let previousFormula = '';
let arrRes = [];
let arrIndex = 0;
let clickTime = 0;

// For web build
if(typeof window !== "undefined") {
  // on load
  window.addEventListener("load", () => {
    const storedVersion = localStorage.getItem("appVersion");

    if (storedVersion === null || storedVersion !== currentVersion) {
      alert(`New JS file of "${currentVersion}" is loaded!`);
      localStorage.setItem("appVersion", currentVersion);
    }
    loadResultOnRead();
  });
  // Tab key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      event.preventDefault();
      document.getElementById("formula-field").focus();
    }
  });
  // Key conversion
  document.getElementById("formula-field").addEventListener("keydown", function (event) {
    if (event.key === "Space" || event.key === " ") {
      const value = document.getElementById("formula-field").value;
      
      if (previousResult !== '' && typeof value === "string" && value.trim() === "") {
        event.preventDefault();
        document.getElementById("formula-field").value = previousResult;
      }
    } 
    else if (["q", "Q"].includes(event.key)) {
      const value = document.getElementById("formula-field").value;
      if (previousFormula !== '' && typeof value === "string" && value.trim() === "") {
        event.preventDefault();
        document.getElementById("formula-field").value = previousFormula;
      }
    }
    else if (event.key === "Enter") {
      event.preventDefault();
      readFormulaField();
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
  // Submitting a formula
  document.getElementById("submit").addEventListener("click", async function () {
    await readFormulaField();
  });
  // Clicking an element
  document.getElementById("results-area").addEventListener("mousedown", function (event) {
    if (event.target && event.target.className === "result-item") {
      clickTime = Date.now();
      const index = Array.from(document.getElementById("results-area").children).indexOf(event.target);
      void VisualizeResultElement(index, 0, "#CCCCCC");
      void VisualizeResultElement(index, 200, "#68FFE5");
    }
  });
  document.getElementById("results-area").addEventListener("mouseup", function (event) {
    if (event.target && event.target.className === "result-item") {
      
      let duration = Date.now() - clickTime;
      if (duration >= 200) return;

      const positionalIndex = Array.from(document.getElementById("results-area").children).indexOf(event.target);
      void VisualizeResultElement(positionalIndex, 0, "#68FFE5");

      const index = (arrIndex - positionalIndex + maxResults) % maxResults;

      const formula = arrRes[index];

      navigator.clipboard.writeText(formula).then(() => {
        alert(`"${formula}" をクリップボードにコピーしました`);
      }).catch(err => {
        console.error("コピー失敗:", err);
      });
    }
  });
  
  // Reporting an issue
  document.getElementById("reportBtn").addEventListener("click", function () {
    const text = encodeURIComponent("#2025電卓　(開発者はこのタグを不定期に検索することでデバッグに取り掛かります！)");
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank");
  });
}

async function VisualizeResultElement(index, pauseDuration, color) {
  await wait(pauseDuration);
  Array.from(document.getElementById("results-area").children)[index].style.color = color;
}

function getCurrentTimestamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function readFormulaField() {
  const formulaRaw = document.getElementById("formula-field").value;

  if (typeof formulaRaw !== "string") {
    alert("The given value is not a string: " + value);
    return;
  }

  if (["clear", "c"].includes(formulaRaw.trim().toLowerCase())) {
    deleteAllResults();
    updateURLOnRead();
    document.getElementById("formula-field").value = "";
    return;
  }

  const solution = window.parseLib.parse(formulaRaw);

  if (solution.success !== ParseStatus.SUCCESS) {
    alert("Error occured: " + solution.success);
    return;
  }
  document.getElementById("formula-field").value = "";
  pushResult(formulaRaw, solution.value, getCurrentTimestamp(), true);
  updateURLOnRead();
}

function updateURLOnRead() {
  let urlStr = "";
  for (let i = 0; i < maxResults; ++i) {
    const el = arrRes[(arrIndex+1+i)%maxResults]; //arrIndex+1 indicates the most bottom element
    
    if (el === null || typeof el !== "string" || el === "") {
      continue;
    }
    urlStr += (el + borderChar);
  }
  saveToHash(saveKey, urlStr);
}

function loadResultOnRead(key = null) {

  key ??= loadFromHash(saveKey);
  if(key === null || typeof key !== "string" || key.trim() === "") return;

  let count = 0,  n = key.length, l = 0, r = 0, e = 0;

  console.log(`n: ${n}`);

  const timestamp = "??:??:??";

  while (count <= maxResults && r < n) {
    while (r < n && key[r] !== borderChar) {
      if (key[r] === "=") e = r;
      ++r;
    }
    if (r >= n) return;
    console.log(`r: ${r}`);
    const fm = key.slice(l, e);
    const sl = key.slice(e+1, r);
    ++r;
    l = r;
    ++count;
    if (typeof window !== "undefined") pushResult(fm, sl, timestamp, false);
    else console.log(`${fm} = ${sl} (${timestamp})`);
  }
}

function deleteAllResults() {
  const resultsArea = document.getElementById("results-area");
  arrRes = [];
  resultsArea.innerHTML = "";
  previousResult = '';
  previousFormula = '';
}

function pushResult(formula, solution, timestamp, shouldAnimate) {
  previousFormula = formula;
  const resultsArea = document.getElementById("results-area");
  const newResult = document.createElement("div");
  newResult.textContent = `📌${formula} = ${solution} (${timestamp})`;
  newResult.className = "result-item";
  if (resultsArea.children.length >= maxResults)
  {
    resultsArea.removeChild(resultsArea.lastChild);
  }
  resultsArea.prepend(newResult);
  previousResult = solution;
  arrIndex = (arrIndex + maxResults + 1) % maxResults;
  arrRes[arrIndex] = `${formula} = ${solution}`;
  if (shouldAnimate) {
    animateColor(newResult, "#A4FCAB", "#68FFE5", 600);
  }
}

if (typeof window === "undefined") {
  loadResultOnRead("50+50 = 100;30+30 = 60;40+40 = 80;");
}

function loadFromHash(key) {
  const hashParams = new URLSearchParams(location.hash.slice(1));
  return decodeURIComponent(hashParams.get(key));
}

function saveToHash(key, value) {
  if (value.trim() === "") {
    history.replaceState(null, null, location.pathname + location.search);
    return;
  }
  
  const hashParams = new URLSearchParams(location.hash.slice(1));
  hashParams.set(key, value);
  location.hash = hashParams.toString();
}

function interpolateColor(color1, color2, factor) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

function animateColor(div, startColor, endColor, duration) {
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const factor = Math.min(elapsed / duration, 1);
    div.style.color = interpolateColor(startColor, endColor, factor);

    if (factor < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
