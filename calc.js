const map = {
    "" : 0,
};

export function parse(f) {
    let tokens = tokenize(f);
    let i = 0;
    let ok;
    while (i < tokens.length && ok)
    {
        [ok, i] = parseExpression(tokens, i);
    }
    if (!ok) return { success: ParseStatus.INVALID_EXPRESSION, result: 0 };
    
    
    
    return { success: ParseStatus.SUCCESS, result: 1 };
}

const ParseStatus = Object.freeze({
    SUCCESS: "success", 
    INVALID_EXPRESSION: "invalid_expression",
    FAILURE: "failure",
});


const functions = ["sin", "cos", "tan", "asin", "acos", "atan", "log", "ln"];

//TODO: not implemented
function getPostfixNotation(tokens) {
    let opStack = [];
    let outStack = [];

    // TODO: 演算記号と括弧と関数の優先度を記した辞書を作る
    
    for (let i = 0; i < tokens.length; i++) {
        let t = tokens[i];
        
        if (isNumber(t)) {
            outStack.push(t);
        }
        else {
            // assume that the rest is all operational symbols
            
            // 0. if it's a closing bracket, pop all to outStack until meeting a closing bracket
            
            // 1. compare the current token and the peek of opStack
            // 2. if it's CeqP or !CgP, insert it
            // 3. put it to opStack if else
        }
    }
    
    // 4. bump all elements in opStack to outStack
    
    return { success: true, result: outStack };
}


//TODO: many errors
function parseExpression(tokens, i = 0) {
    if (i >= tokens.length) return [false, i];

    // General independent items
    const t = tokens[i];
    if (isNumber(t) || isConstant(t) || isOperatorSymbol(t)) { //TODO: 数字群の間にoperatorが挟まらない場合は違法とする　operatorの連続も違法とする
        return [true, i + 1];
    }
    
    // Pairs
    if (isParenthesis(t) || isSquareBracket(t)){ //TODO: 同様に過去のデータ次第でtrueかどうかが変わる場合の実装方法を検討する
        return [true, i + 1];
    }
    
    // log(...)
    if (t === "log") {
        i++;
        let ok;
        if (tokens[i] === "[") {
            // log[base](value)
            i++;
            [ok, i] = parseExpression(tokens, i);
            if (!ok || tokens[i] !== "]") return [false, i];
            i++;
            if (tokens[i] !== "(") return [false, i];
            i++;
            [ok, i] = parseExpression(tokens, i);
            if (!ok || tokens[i] !== ")") return [false, i];
            return [true, i + 1];
        } else if (tokens[i] === "(") {
            // log(value)
            i++;
            [ok, i] = parseExpression(tokens, i);
            if (!ok || tokens[i] !== ")") return [false, i];
            return [true, i + 1];
        } else {
            return [false, i]; // Invalid log (intolerant to log x bs)
        }
    }

    // trig's and ln
    if (functions.includes(tokens[i])) { //TODO: sin^5(30)とかは有効にしないといけないから...expressionを(で終わるようにしないと
        if (tokens[++i] !== "(") return [false, i];
        let ok;
        [ok, i] = parseExpression(tokens, ++i);
        if (!ok || tokens[i] !== ")") return [false, i];
        return [true, i + 1];
    }

    return [false, i];
}

function tokenize(s) {
    let i = 0, n = s.length;
    const tokens = [];

    while (i < n) {
        // space
        if (isSpace(s[i])) {
            i++;
            continue;
        }

        // number
        if (isDigit(s[i])) {
            let j = i;
            let periodSeen = false;

            while (j < n && (isDigit(s[j]) || (!periodSeen && s[j] === "."))) {
                if (s[j] === ".") periodSeen = true;
                j++;
            }

            tokens.push(s.slice(i, j));
            i = j;
            continue;
        }

        // operator symbols
        if (isOperatorSymbol(s[i])) {
            if (s[i] === "-" && (tokens.length === 0 || ["(", "["].includes(tokens[tokens.length - 1]))) tokens.push("0");
            
            tokens.push(s[i]);
            i++;
            continue;
        }

        // parenthesis
        if (isParenthesis(s[i])) {
            if (i > 0 && s[i] === "(" && (isDigit(s[i-1]) || isConstant(s[i-1])) || (tokens.length > 0 && tokens[tokens.length - 1] === ")"))   tokens.push("*");
            tokens.push(s[i]);
            if (i+1 < n && s[i] === ")" && (isDigit(s[i+1]) || isConstant(s[i+1]))) tokens.push("*");
            i++;
            continue;
        }
        
        // functions
        let matchedFunc = functions.find(fn => s.slice(i, i + fn.length) === fn);
        if (matchedFunc) {
            tokens.push(matchedFunc);
            i += matchedFunc.length;
            continue;
        }
        
        // constants
        if (isConstant(s[i])) {
            if (i > 0 && isNumber(s[i-1])) tokens.push("*");
            tokens.push(s[i]);
            i++;
            continue;
        }
        
        // lame
        // if (isSquareBracket(s[i])) {
        //     tokens.push(s[i]);
        //     i++;
        //     continue;
        // }

        // the rest (should not be called... lol)
        alert(`Warning: contains an invalid character "${s[i]}"`);
        tokens.push(s[i]);
        i++;
    }

    return tokens;
}


// helper methods
function tryGetPrecedence(token) {
    return { success: false, result : 0};
} //TODO: fix this after creating a dictionary

function isNumber(token) {
    if(typeof token !== "string") return false;
    
    let periodSeen = false;
    for (let i = 0; i < token.length; i++) {
        if (isDigit(token[i]) || (!periodSeen && token[i] === ".")) {
            if (token[i] === ".") periodSeen = true;
            continue;
        }
        return false;
    }
    return true;
}
const isSquareBracket = (token) => ["[", "]"].includes(token);
const isParenthesis = (token) => ["(", ")"].includes(token);
const isSpace = (token) => /^\s+$/.test(token);
const isOperatorSymbol = (token) => ["+", "-", "*", "/", "^", "%"].includes(token);
const isDigit = (token) => /^\d+$/.test(token);
const isConstant = (token) => ["π", "e"].includes(token);

