export function parse(f) {
    return 0;
}

const ParseStatus = Object.freeze({
  SUCCESS: "success",
  INVALID_TYPE: "invalid_type",
  MISSING_OPERATOR: "missing operator",
  UNMATCHED_SYMBOL: "unmatched_symbol",
  EMPTY_STRING: "empty_string",
  INVALID_CHAR: "invalid_char"
});

export function getPostfixNotation(f) {
  let opStack = [];
  let numStack = [];
  let i = 0, n = f.length;

   while(i < n) {
    let c = f[i];

    if (IsEmpty(c) {
      while(f[i] < n && IsEmpty(f[i])) ++i;
      continue;
    }

    if (IsNumber(c)) {
      // Get a substring of a number
      let l = i;
      while(f[i] < n && IsNumber(f[i])) ++i;
      let numberStr = f.substring(l, i);

      // Push to the stack
      numStack.push(numberStr);

      if (opStack.length === 0) {
        return { success: ParseStatus.UNMATCHED_SYMBOL };
      }
      numStack.push(opStack.pop());
      continue;
    }
  
    if (IsOpSymbol(c))
    {
      opStack.push(c);
      continue;
    }

    if (IsConstant(c)) {
      // Insert an implicit mulitiplication symbol as needed
      if (i > 0 && IsNumber(f[i])) {
        opStack.push("*");
      }
      
      numStack.push(c);
      if (opStack.length === 0) {
        return { success: ParseStatus.MISSING_OPERATOR };
      }
      numStack.push(opStack.pop());
      continue;
    }

    if (IsPrefixFunc(c))
    {
      switch(c){
        case "l":
          if(i + 4 < n && f.substring(l, i+4) === "log")//TODO:
        break;
      }
    }

    
  }
}

// helper methods
function IsParenthesis(char)
{
  const parenthesis = ["(", ")"];
  return parenthesis.includes(char);
}

function IsPrefixFunc(char)
{
  const prefices = ["l", "s", "c", "t"];
  return prefices.includes(char);
}

function IsEmpty(char) {
  return char === " ";
}

function IsNumber(char) {
  return parseInt(char, 10) === char;
}

function IsOpSymbol(char) {
  const operators = ["+", "-", "*", "_", "^", "%"];
  return operators.includes(char);
}

function IsConstant(char) {
  const constants = ["π", "e"];
  return constants.includes(char);
}
