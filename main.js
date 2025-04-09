document.getElementById("submit").addEventListener("click", function () {
  const value = document.getElementById("formula-field").value;
  
  if (typeof value !== "string") 
  {
    alert("The given value is not a string: " + value);
    return;
  }
  //let n = value.length;
  //if (/\d/.test(c)) 

  const result = parseAndEvaluate(value);
  if (!result.success)
  {
    alert("The given value contains invalid words: " + value);
    return;
  }
  alert("calculation result: " + result.value);
});

document.getElementById("reportBtn").addEventListener("click", function () {
  const text = encodeURIComponent("#2025電卓　(開発者はこのタグを不定期に検索することでデバッグに取り掛かります！)");
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(url, "_blank");
});


function parseAndEvaluate(expr) {
  if (!/^[0-9+\-*/. ]+$/.test(expr))  return { success: false };

  try {
    let result = eval(expr);
    return { success: true, value: result };
  } catch (e) {
    return { success: false };
  }
}
