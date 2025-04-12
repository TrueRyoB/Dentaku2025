const currentVersion = "18:10";
const functions = ["sin", "cos", "tan", "asin", "acos", "atan", "log", "ln"];

const map = {
    "+" : 1,
    "-": 1,
    "*" : 2,
    "/" : 2,
    "%" : 2,
    "**" : 3,
};

const operators = {
    "+": { arity: 2, fn: (a, b) => a + b },
    "-": { arity: 2, fn: (a, b) => a - b },
    "*": { arity: 2, fn: (a, b) => a * b },
    "/": { arity: 2, fn: (a, b) => a / b },
    "%": { arity: 2, fn: (a, b) => ((a % b) + b) % b },
    "**": { arity: 2, fn: (a, b) => a ** b }, //TODO: **のassociativityを考慮して変更する
    "sin": { arity: 1, fn: (a) => Math.sin(a) },
    "cos": { arity: 1, fn: (a) => Math.cos(a) },
    "tan": { arity: 1, fn: (a) => Math.tan(a) },
    "asin": { arity: 1, fn: (a) => Math.asin(a) },
    "acos": { arity: 1, fn: (a) => Math.acos(a) },
    "atan": { arity: 1, fn: (a) => Math.atan(a) },
    "ln": { arity: 1, fn: (a) => Math.log(a) },
};

const constants = {
    "π": { value : Math.PI },
    "e" : { value : Math.E },
};

const isOperatorSymbol = (token) => ["+", "-", "*", "/", "**", "%"].includes(token);

const ParseStatus = Object.freeze({
    SUCCESS: "success",
    INVALID_EXPRESSION: "invalid_expression",
    UNMATCHED_BRACKET: "unmatched_bracket",
    UNREGISTERED_TOKEN: "unregistered_token",
    CONSECUTIVE_CONSTANT: "consecutive_constant",
    UNPAIRED_OPERANT: "unpaired_operant",
    INVALID_PARENTHESIS: "invalid_parenthesis",
    FAILURE: "failure",
});

(function() {
    window.parseLib = window.parseLib || {};
    window.parseLib.parse = parse;
})();

function parse(f) {
    let tokens = tokenize(f);
    let i = 0;
    let ok = true;
    while (i < tokens.length && ok)
    {
        [ok, i] = parseExpression(tokens, i);
    }
    if (!ok) return { success: ParseStatus.INVALID_EXPRESSION, value: 0 };
    
    if (!validateParenthesis(tokens)) return { success: ParseStatus.INVALID_PARENTHESIS, value: 0 };
    
    let post = getPostfixNotation(tokens);
    if (post.success !== ParseStatus.SUCCESS) return { success: post.success, value: 0 };
    console.log(post.result.join(" "));
    
    let res = evaluatePostfix(post.result);
    
    return { success: res.success, value: res.success === ParseStatus.SUCCESS ? res.result : 0 };
}

function validateParenthesis(tokens) {
    let stack = [];
    const openers = { "(": ")", "[": "]" };
    const closers = { ")": "(", "]": "[" };

    for (let t of tokens) {
        if (t in openers)
            stack.push(t);
        else if (t in closers) {
            if (stack.length === 0 || stack[stack.length - 1] !== closers[t]) {
                return false;
            }
            stack.pop();
        }
    }
    return stack.length === 0;
}

function evaluatePostfix (post) {
    let numStack = [];
    for(let i = 0; i < post.length; i++) {
        let t = post[i];
        
        if (isNumber(t)) {
            t = parseFloat(t);
            numStack.push(t);
        } else if (isConstant(t)) {
            numStack.push(constants[t].value);
        } else {
            
            let op = operators[t];
            if (!op) {
                alert(`Error: unrecognized token "${t}"!`);
                return { success: ParseStatus.UNREGISTERED_TOKEN, result: 0 };
            }

            if (numStack.length < op.arity) return { success: ParseStatus.UNPAIRED_OPERANT, result: 0 };

            
            const args = [];
            for (let j = 0; j < op.arity; j++) args.unshift(numStack.pop());
            
            const result = op.fn(...args);
            numStack.push(result);
        }
    }
    if(numStack.length > 1) return { success: ParseStatus.UNPAIRED_OPERANT, result: 0 };
    return { success: ParseStatus.SUCCESS, result: numStack[0] };
}

function getPostfixNotation(tokens) {
    let opStack = [];
    let outStack = [];
    
    for (let i = 0; i < tokens.length; i++) {
        let t = tokens[i];
        
        if (isNumber(t)) {
            outStack.push(t);
        }
        // Assume that the rest is all operational symbols
        else {
            
            // 0. push an open bracket to opStack no matter what
            if (["(", "["].includes(t)) {
                opStack.push(t);
                continue;
            }
            
            // 1. if it's a closing bracket, pop all to outStack until meeting a closing bracket
            if ([")", "]"].includes(t)) {
                let opening = t === ")" ? "(" : "[";
                while (opStack.length > 0 && opStack[opStack.length - 1] !== opening) outStack.push(opStack.pop());
                if (opStack.length === 0) {
                    alert(`Error: unmatched closing parenthesis!"`);
                    return { success: ParseStatus.UNMATCHED_BRACKET, result: null };
                }
                opStack.pop();
                // push the subsequent function operator as well if there exists one
                if (opStack.length > 0 && functions.includes(opStack[opStack.length - 1])) outStack.push(opStack.pop());
                continue;
            }
            
            // 2. compare the current token and the peek of opStack
            if (functions.includes(t)) {
                opStack.push(t);
                continue;
            }
            
            if (! (t in map)) {
                alert(`Error: token "${t} is not registered to the precedence map!"`);
                return { success: ParseStatus.UNREGISTERED_TOKEN, result: null };
            }
            
            // 3. Push to the appropriate stack //TODO: 不安
            let shouldPushToOutput = opStack.length > 0 && map[t] >= map[opStack[opStack.length - 1]];
            
            if (shouldPushToOutput) outStack.push(t);
            else opStack.push(t);
        }
    }
    
    // 3. bump all elements in opStack to outStack
    while (opStack.length > 0) outStack.push(opStack.pop());
    
    return { success: ParseStatus.SUCCESS, result: outStack };
}

function parseExpression(tokens, i) {
    if (i >= tokens.length) return [false, i];

    // Numbers
    if (isNumber(tokens[i]) || isConstant(tokens[i])) {
        const pre = tokens[i-1];
        return [i === 0 || !(isNumber(pre) || isConstant(pre)), i + 1];
    }
    
    // Operator symbols
    if (isOperatorSymbol(tokens[i])) {
        const pre = tokens[i-1];
        return [i === 0 || !isOperatorSymbol(pre), i + 1];
    }
    
    // Pairs
    if (isParenthesis(tokens[i]) || isSquareBracket(tokens[i])){
        return [true, i + 1];
    }
    
    // log(...)
    if (tokens[i] === "log") {
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
    if (functions.includes(tokens[i])) {
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
            let exponentIndex = -310;

            while (j < n && (isDigit(s[j]) || (!periodSeen && s[j] === ".") || (exponentIndex !== -310 && s[j] === "e") || (j === exponentIndex+1 && s[j] === "-"))) {
                if (s[j] === ".") periodSeen = true;
                if (s[j] === "e") exponentIndex = j;
                j++;
            }
            
            if (j !== -310 && j < exponentIndex + 2) j = exponentIndex-1;

            tokens.push(s.slice(i, j));
            i = j;
            continue;
        }

        // operator symbols
        if (isOperatorSymbol(s[i])) {
            if (s[i] === "-" && (tokens.length === 0 || ["(", "["].includes(tokens[tokens.length - 1]))) tokens.push("0");
            
            if (s[i] === "*" && i+1 < n && s[i+1] === "*") {
                tokens.push("**");
                i += 2;
            } else {
                tokens.push(s[i]);
                i++;
            }
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
const isNumber = (token) => !isNaN(token);
const isSquareBracket = (token) => ["[", "]"].includes(token);
const isParenthesis = (token) => ["(", ")"].includes(token);
const isSpace = (token) => /^\s+$/.test(token);
const isDigit = (token) => /^\d+$/.test(token);
const isConstant = (token) => token in constants;
