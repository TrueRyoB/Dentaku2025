const testcase = [
    ["1-1", {solution: "0", isValid: true}],
    ["(1)-1", {solution: "0", isValid: true}],
    ["(1)(-1)", {solution: "-1", isValid: true}],
    ["(2**2)**3", {solution: "64", isValid: true}],
    ["2**2**3", {solution: "256", isValid: true}],
    ["-1", { solution: "-1", isValid: true }],
    ["10-10*10", { solution: "-90", isValid: true }],
    ["10*10-10", { solution: "90", isValid: true }],
    ["sin(π/2)", { solution: "1", isValid: true }],
    ["sin(-π/2)", { solution: "-1", isValid: true }],
    ["sinsin0", {solution: "0", isValid: true}],
    ["acoscosacos(((1)))", { solution: "0", isValid: true }],
    ["tan(π / 4)", { solution: "1", isValid: true }],
    ["asin(1)", { solution: "π / 2", isValid: true }],
    ["acos(0)", { solution: "π / 2", isValid: true }],
    ["atan(1)", { solution: "π / 4", isValid: true }],
    ["ln(e)", { solution: "1", isValid: true }],
    ["ln(e^2)", { solution: "2", isValid: true }],
    ["2 + 3 * (4 - 1)", { solution: "11", isValid: true }],
    ["cos(0)", { solution: "1", isValid: true }],
    ["cos((0))", { solution: "1", isValid: true }],
    ["((1))acos((0))", { solution: "π/2", isValid: true }],
    ["log(10, 1000)", { solution: "3", isValid: true }],
    ["log(100)", { solution: "2", isValid: true }],
    ["log(10, 1000)", { solution: "3", isValid: true }],
    ["log(398, -sin(-π/2))", { solution: "0", isValid: true }],
    ["log(10, 100)", { solution: "2", isValid: true }],
    ["atan(1)", { solution: "π/4", isValid: true }],
    ["atan(1, 1)", { solution: "π/4", isValid: true }],
    ["atan(1 1)", { solution: "π/4", isValid: true }],
    ["atan(1 -1)", { solution: "0", isValid: true }],
    ["atan(1 (-1))", { solution: "-π/4", isValid: true }],
    ["atan(-1, 1)", { solution: "-π/4", isValid: true }],
    ["atan(-1 1)", { solution: "-π/4", isValid: true }],
    ["atan(1, -1)", { solution: "3*π/4", isValid: true }],
    ["atan(-1, -1)", { solution: "-3*π/4", isValid: true }],
    ["atan (-1*(1)+1, 1)", { solution: "0",isValid: true }],
    ["atan (1**(4/3)-3/2, 1/2-1**0)", { solution: "-3*π/4",isValid: true }],
    ["atan 1, 1", { solution: "π/4",isValid: true }],
    ["atan 1, (1)", { solution: "π/4",isValid: true }],
    ["atan -2, 2", { solution: "-π/4",isValid: true }],
    ["atan 1*-2, (1/1)*2", { solution: "-π/4",isValid: true }],
    ["(sin0)", { solution: "0",isValid: true }],
    ["1*(cossin0)", { solution: "1",isValid: true }],
    ["atan(tan(1), 1)", {solution: "1", isValid: true}],
    ["sind30", {solution: "1/2", isValid: true}],
    ["max(3, -1)", {solution: "3", isValid: true}],
    ["min3, -1", {solution: "-1", isValid: true}],
    ["πeπeπ", {solution: "229.10711780970053", isValid: true}],
    ["maizen1+3", {solution: "0", isValid: false}],
    ["ma1zen", {solution: "0", isValid: false}],
    ["stop", {solution: "0", isValid: false}],
    ["sin(π) + 1", {solution: "1", isValid: true}],
    ["sinπ + 1", {solution: "1", isValid: true}],
    ["sin(π + 1)", {solution: "-0.14112000805986735", isValid: true}],
    ["5!", {solution: "120", isValid: true}],
    
    // Impossible-to-pass
    ["atantan1, 1", {solution: "1", isValid: true}],
    ["atanatan1, 1, π/4", {solution: "π/4", isValid: true}],
];

const currentVersion = "release 1.0";
const silent = true, loud = false;
const functions = ["sind", "cosd", "tand", "asind", "acosd", "atand", "atand2", 
    "sin", "cos", "tan", "asin", "acos", "atan", "atan2", "log", "log2", "ln", "max", "min", "abs"];

const operators = {
    "(" : { precedence: 0, arity: 0, fn: null, isotopes: null, isLeftAssociativity: true },
    "[" : { precedence: 0, arity: 0, fn: null, isotopes: null, isLeftAssociativity: true },
    ")" : { precedence: 0, arity: 0, fn: null, isotopes: null, isLeftAssociativity: true },
    "]" : { precedence: 0, arity: 0, fn: null, isotopes: null, isLeftAssociativity: true },
    "+": { precedence: 1, arity: 2, fn: (a, b) => a + b, isotopes: null, isLeftAssociativity: true },
    "-": { precedence: 1, arity: 2, fn: (a, b) => a - b, isotopes: null, isLeftAssociativity: true },
    "*": { precedence: 2, arity: 2, fn: (a, b) => a * b, isotopes: null, isLeftAssociativity: true },
    "/": { precedence: 2,  arity: 2, fn: (a, b) => a / b, isotopes: null, isLeftAssociativity: true },
    "%": { precedence: 2, arity: 2, fn: (a, b) => ((a % b) + b) % b, isotopes: null, isLeftAssociativity: true },
    "**": { precedence: 3, arity: 2, fn: (a, b) => a ** b, isotopes: null, isLeftAssociativity: false},
    "!": {precedence:3, arity:1, fn:(a) => factorial(a), isotopes: null, isLeftAssociativity: true},
    "sind": { precedence: 4, arity: 1, fn: (a) => Math.sin(degToRad(a)), isotopes: null, isLeftAssociativity: true }, 
    "cosd": { precedence: 4, arity: 1, fn: (a) => Math.cos(degToRad(a)), isotopes: null, isLeftAssociativity: true }, 
    "tand": { precedence: 4,  arity: 1, fn: (a) => Math.tan(degToRad(a)), isotopes: null, isLeftAssociativity: true },
    "asind": { precedence: 4, arity: 1, fn: (a) => radToDeg(Math.asin(a)), isotopes: null, isLeftAssociativity: true },
    "acosd": { precedence: 4, arity: 1, fn: (a) => radToDeg(Math.acos(a)), isotopes: null, isLeftAssociativity: true },
    "atand": { precedence: 4, arity: 1, fn: (a) => radToDeg(Math.atan(a)), isotopes: ["atand2"], isLeftAssociativity: true },
    "atand2": { precedence: 4, arity: 2, fn: (a, b) => radToDeg(Math.atan2(a, b)), isotopes: null, isLeftAssociativity: true },
    "sin": { precedence: 4, arity: 1, fn: (a) => Math.sin(a), isotopes: null, isLeftAssociativity: true },
    "cos": { precedence: 4, arity: 1, fn: (a) => Math.cos(a), isotopes: null, isLeftAssociativity: true },
    "tan": { precedence: 4,  arity: 1, fn: (a) => Math.tan(a), isotopes: null, isLeftAssociativity: true },
    "asin": { precedence: 4, arity: 1, fn: (a) => Math.asin(a), isotopes: null, isLeftAssociativity: true },
    "acos": { precedence: 4, arity: 1, fn: (a) => Math.acos(a), isotopes: null, isLeftAssociativity: true },
    "atan": { precedence: 4, arity: 1, fn: (a) => Math.atan(a), isotopes: ["atan2"], isLeftAssociativity: true },
    "atan2": { precedence: 4, arity: 2, fn: (a, b) => Math.atan2(a, b), isotopes: null, isLeftAssociativity: true},
    "log": { precedence: 5, arity: 1, fn: (a) => Math.log(a) / Math.log(10), isotopes: ["log2"], isLeftAssociativity: true }, 
    "log2": { precedence: 5, arity: 2, fn: (a, b) => Math.log(b) / Math.log(a), isotopes: null, isLeftAssociativity: true },
    "ln": { precedence: 5, arity: 1, fn: (a) => Math.log(a), isotopes: null, isLeftAssociativity: true },
    "max": { precedence: 5, arity: 2, fn: (a, b) => (a >= b) ? a : b, isotopes: null, isLeftAssociativity: true },
    "min": { precedence: 5, arity: 2, fn: (a, b) => (a <= b) ? a : b, isotopes: null, isLeftAssociativity: true },
    "abs": { precedence: 5, arity: 1, fn: (a) => (a < 0) ? -a : a, isotopes: null, isLeftAssociativity: true },
};

const constants = {
    "π": { value : Math.PI },
    "e" : { value : Math.E },
};

const isOperatorSymbol = (token) => ["+", "-", "*", "/", "**", "%", "!"].includes(token) || ["^"].includes(token);

const ParseStatus = Object.freeze({
    SUCCESS: "success",
    INVALID_EXPRESSION: "invalid_expression",
    UNMATCHED_BRACKET: "unmatched_bracket",
    UNREGISTERED_TOKEN: "unregistered_token",
    CONSECUTIVE_CONSTANT: "consecutive_constant",
    UNPAIRED_OPERANT: "unpaired_operant",
    INVALID_PARENTHESIS: "invalid_parenthesis",
    MISSING_PARAMETERS: "missing_parameters",
    FAILURE: "failure",
});

(function() {
    if (typeof window !== "undefined") {
        window.parseLib = window.parseLib || {};
        window.parseLib.parse = parse;
    }
})();
function parse(f) {
    let tokens = tokenize(f);
    silentPrint("Tokens => " + tokens.join(" "));
    let i = 0, ok, stack = [];
    [ok, i] = parseExpression(tokens, i, stack, 0);
    silentPrint("Parsed tokens => " + tokens.join(" "));
    if (!ok) return { success: ParseStatus.INVALID_EXPRESSION, value: i };
    
    let post = getPostfixNotation(tokens);
    if (post.success !== ParseStatus.SUCCESS) return { success: post.success, value: 0 };
    silentPrint("Postfix notation => " + post.result.join(" "));
    
    let res = evaluatePostfix(post.result);
    
    return { success: res.success, value: res.success === ParseStatus.SUCCESS ? res.result : 0 };
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
                notifyError(`Error: unrecognized token "${t}"!`);
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
        
        if (isNumber(t) || isConstant(t)) {
            outStack.push(t);
        }
        // Assume that the rest is all operational symbols
        else {
            
            // -1. discard irrelevant symbols
            if ([","].includes(t)) {
                continue;
            }
            
            // 0. push an open bracket to opStack no matter what
            if (isOpenBracket(t)) {
                opStack.push(t);
                continue;
            }
            
            // 1. if it's a closing bracket, pop all to outStack until meeting a closing bracket
            if (isClosingBracket(t)) {
                let opening = t === ")" ? "(" : "[";
                while (opStack.length > 0 && opStack[opStack.length - 1] !== opening) outStack.push(opStack.pop());
                if (opStack.length === 0) {
                    notifyError(`Error: unmatched closing parenthesis!"`);
                    return { success: ParseStatus.UNMATCHED_BRACKET, result: null };
                }
                opStack.pop();
                continue;
            }
            
            // 2. compare the current token and the peek of opStack
            if (functions.includes(t)) {
                opStack.push(t);
                continue;
            }

            // 3. Push to the appropriate stack
            while (opStack.length > 0 && !isOpenBracket(opStack[opStack.length - 1])) {
                
                if (!opStack[opStack.length-1] in operators) {
                    notifyError(`Error: token ${t} is not registered to the operators' list!`);
                    return { success: ParseStatus.UNREGISTERED_TOKEN, result: null };
                }
                let topOp = opStack[opStack.length - 1];
            
                if (t === "**") {
                    if (operators[topOp].precedence > operators[t].precedence) {
                        outStack.push(opStack.pop());
                    } else {
                        break;
                    }
                }
                
                else {
                    if (operators[topOp].precedence >= operators[t].precedence) {
                        outStack.push(opStack.pop());
                    } else {
                        break;
                    }
                }
            }
            opStack.push(t);
        }
    }
    
    // 3. bump all elements in opStack to outStack
    while (opStack.length > 0) outStack.push(opStack.pop());
    
    return { success: ParseStatus.SUCCESS, result: outStack };
}
function parseExpression(tokens, i, stack, nest) {
    if (i >= tokens.length) return [tokens.length > 0 && stack.length === 0 && !(isOperatorSymbol(tokens[tokens.length-1] && operators[tokens[tokens.length-1].arity==2])) && tokens[tokens.length-1] !== ",", i, stack, nest];

    // Numbers
    if (isNumber(tokens[i]) || isConstant(tokens[i])) {
        const pre = tokens[i-1];

        if (i === 0 || !(isNumber(pre) || isConstant(pre))) return parseExpression(tokens, i+1, stack, nest);
        return [false, i, stack, nest];
    }

    // Operator symbols
    if (isOperatorSymbol(tokens[i])) {
        const pre = tokens[i-1];
        
        if (i !== 0 && (!isOperatorSymbol(pre) || functions.includes(pre))) return parseExpression(tokens, i+1, stack, nest);
        return [false, i, stack, nest];
    }
    
    if (functions.includes(tokens[i])) {
        
        let isotopes = operators[tokens[i]].isotopes;
        let max = operators[tokens[i]].arity;
        let originalIndex = i;
        
        const map = new Map();
        map.set(max, tokens[i]);
        if (isotopes !== null) {
            for (let j=0; j<isotopes.length; ++j) {
                const arity = operators[isotopes[j]].arity;
                max = Math.max(max, arity);
                map.set(arity, isotopes[j]);
            }
        }
        
        let t = 0;
        while (t < max) {
            [ok, i, stack, next] = parseExpression(tokens, i+1, stack, nest+1);
            if (!ok) return [false, i, stack, nest];
            ++t;
            loudPrint(`t: ${t}, i: ${i}, tokens[i]: ${tokens[i]}, nest: ${nest}`)
            if (i+2 >= tokens.length || !(tokens[i] === "[" || tokens[i] === ",")) break;
            if (tokens[i] === "[") i = i-1;
        }
        
        if (!map.has(t)) return [false, i, stack, nest];
        tokens[originalIndex] = map.get(t);
        return parseExpression(tokens, i, stack, nest);
    }

    // Brackets
    if (isOpenBracket(tokens[i])) {
        stack.push(tokens[i]);
        return parseExpression(tokens, i+1, stack, nest);
    }
    if (isClosingBracket(tokens[i])) {
        if (i > 0 && tokens[i-1] === ",") return [false, i, stack, nest];
        
        const closers = { ")": "(", "]": "[" };
        if (stack.length === 0 || stack[stack.length-1] !== closers[tokens[i]] || i === 0 || tokens[i-1] === closers[tokens[i]]) return [false, i, stack, nest];
        stack.pop();
        if (nest === 0 || tokens[i] === ")") return parseExpression(tokens, i+1, stack, nest);
        return [true, i + 1, stack, nest-1];
    }
    
    // Comma
    if (tokens[i] === ",") {
        return parseExpression(tokens, i+1, stack, nest);
    }

    return [false, i];
}
function tokenize(s) {
    let i = 0, n = s.length;
    const tokens = [];
    let bStack = [];
    let invalidString = "";

    while (i < n) {
        // space
        if (isSpace(s[i])) {
            i++;
            continue;
        }

        // parenthesis
        if (isParenthesis(s[i])) {
            const peek = tokens[tokens.length-1];

            if (s[i] === "(" && tokens.length > 0) {
                if (isNumber(peek) || isConstant(peek) || peek === ")") {
                    tokens.push("*");
                }
            }
            //通常通りpushするのは変わらんけど、bracket系統は全部stackに入れる
            // )を入れるときは、peekが(になるまで直前に]を入れ続けて[を打ち消す
            else if (s[i] === ")") {
                const pair = { "[" : "]" }
                while (bStack.length > 0 && bStack[bStack.length-1] !== "(") tokens.push(pair[bStack.pop()]);
            }

            tokens.push(s[i]);
            if(s[i] === "(") bStack.push("(");
            if(s[i] === ")") bStack.pop();
            
            if (s[i] === "(" && tokens.length > 0) {
                if (functions.includes(peek)) {
                    tokens.push("[");
                    bStack.push("[");
                }
            }
            i++;
            
            invalidString = checkInvalidString(invalidString);
            continue;
        }
        // function +a
        else {
            if (functions.includes(tokens[tokens.length-1])) {
                tokens.push("[");
                bStack.push("[");
            }
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
            
            let str = s.slice(i, j);
            
            if (tokens.length > 0) {
                const peek = tokens[tokens.length-1];
                if (peek === "-") {
                    const nextPeek = tokens[tokens.length-2];
                    if (tokens.length === 1 || !(isNumber(nextPeek) || isConstant(nextPeek) || isClosingBracket(nextPeek))) {
                        tokens.pop();
                        str = "-" + str;
                    } 
                } else if (bStack[bStack.length-1] === "[" && (isNumber(peek) || isConstant(peek))){
                    tokens.push("]");
                    tokens.push("[");
                }
            }

            if (tokens.length > 0 && tokens[tokens.length-1] === ")") tokens.push("*");
            tokens.push(str);
            i = j;
            invalidString = checkInvalidString(invalidString);
            continue;
        }

        // operator symbols
        if (isOperatorSymbol(s[i])) {
            if (s[i] === "*" && i+1 < n && s[i+1] === "*") {
                tokens.push("**");
                i += 2;
            } else if (s[i] === "^") {
                tokens.push("**");
                i += 1;
            } else {
                tokens.push(s[i]);
                i += 1;
            }
            invalidString = checkInvalidString(invalidString);
            continue;
        }
        
        // functions
        let matchedFunc = functions.find(fn => s.slice(i, i + fn.length) === fn);
        if (matchedFunc) {
            if (tokens.length > 0 && tokens[tokens.length-1] === "-" && (i === 1 || (!isClosingBracket(tokens[tokens.length-2]) && !isNumber(tokens[tokens.length-2]) && !isConstant(tokens[tokens.length-2])))) {
                tokens.pop();
                tokens.push("-1");
                tokens.push("*");
            } 
            else if (tokens.length > 0 && (isNumber(tokens[tokens.length-1]) || isConstant(tokens[tokens.length-1]) || isClosingBracket(tokens[tokens.length-1]))) {
                tokens.push("*");
            }
            tokens.push(matchedFunc);
            i += matchedFunc.length;
            invalidString = checkInvalidString(invalidString);
            continue;
        }
        
        // constants
        if (isConstant(s[i])) {
            if (tokens.length > 0 && (isNumber(tokens[tokens.length-1]) || isConstant(tokens[tokens.length-1]))) tokens.push("*");

            if (tokens.length > 0) {
                const peek = tokens[tokens.length - 1];
                if (bStack[bStack.length-1] === "[" && (isNumber(peek) || isConstant(peek))) {
                    tokens.push("]");
                    tokens.push("[");
                }
            }
            
            if (i > 0 && tokens[tokens.length-1] === "-" && (i === 1 || (!isNumber(tokens[tokens.length-2]) && !isConstant(tokens[tokens.length-2])))) {
                tokens.pop();
                tokens.push("-1");
                tokens.push("*");
            }
            tokens.push(s[i]);
            i++;
            invalidString = checkInvalidString(invalidString);
            continue;
        }
        
        // square bracket
        if (isSquareBracket(s[i])) {
            tokens.push(s[i]);
            i++;
            invalidString = checkInvalidString(invalidString);
            continue;
        }
        
        // comma
        if (s[i] === ",") {
            if (bStack[bStack.length-1] === "[")  tokens.push("]");
            tokens.push(s[i]);
            if (bStack[bStack.length-1] === "[")  tokens.push("[");
            ++i;
            invalidString = checkInvalidString(invalidString);
            continue;
        }

        // the rest
        invalidString += s[i];
        if (i === n-1) {
            invalidString = checkInvalidString(invalidString);
        }
        tokens.push(s[i]);
        i++;
    }
    
    const pair = { "[" : "]"}
    while (bStack.length > 0) tokens.push(pair[bStack.pop()]);
    return tokens;
}

// helper methods
const radToDeg = (number) => number * 180 / Math.PI;
const degToRad = (number) => number * Math.PI / 180;
const isNumber = (token) => !isNaN(token);
const isSquareBracket = (token) => ["[", "]"].includes(token);
const isParenthesis = (token) => ["(", ")"].includes(token);
const isOpenBracket = (token) => ["(", "["].includes(token);
const isClosingBracket = (token) => [")", "]"].includes(token);
const isSpace = (token) => /^\s+$/.test(token);
const isDigit = (token) => /^\d+$/.test(token);
const isConstant = (token) => token in constants;
const sameFloat = (t1, t2) => Math.abs(t1-t2) < 0.001;
function notifyError(message) {
    if (typeof window !== "undefined") {
        alert(message);
    } else if (!silent){
        console.error(message);
    }
}
function loudPrint(message) {
    if (loud && !silent && typeof window === "undefined" && typeof message == "string") {
        console.log(message);
    }
}
function silentPrint(message) {
    if (!silent && typeof window === "undefined" && typeof message === "string") {
        console.log(message)
    }
}
function evaluateSimple(expr) {
    //Replace all constants with its equivalent numbers
    for(let i = 0; i < expr.length; i++) {
        if (isConstant(expr[i])) {
            let insertStr = constants[expr[i]].value.toString();
            expr = expr.slice(0, i) + expr.slice(i + 1);
            expr = expr.slice(0, i) + insertStr + expr.slice(i);
            i += insertStr.length-1;
        }
    }
    //Use the default evaluation
    try {
        let result = eval(expr);
        return {success: true, value : result};
    } catch {
        return {success: false, value : 0};
    }
}
function checkInvalidString(invalidString) {
    if (invalidString.length !== 0) {
        notifyError(invalidString.length === 1 ? `Warning: contains an invalid character \"${invalidString}\"` : `Warning: contains an invalid string \"${invalidString}\"`);
    }
    return "";
}
function gamma(z) {
    // Lanczos approximation coefficients
    const p = [
        676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012,
        9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    
    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }
    
    z -= 1;
    let x = 0.99999999999980993;
    
    for (let i = 0; i < p.length; i++) {
        x += p[i] / (z + i + 1);
    }
    
    const t = z + p.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function factorial(x) {
    if (Number.isInteger(x) && x >= 0) {
        // Integer case - use regular factorial
        let result = 1;
        for (let i = 2; i <= x; i++) result *= i;
        return result;
    }
    return gamma(x + 1);
}
// for debug
if (typeof window === "undefined") {
    main();
}
function main() {
    for (let i=0; i < testcase.length; ++i) {
        let t = testcase[i];
        let result = parse(t[0]);
        
        if(t[1].isValid) {
            let solution = evaluateSimple(t[1].solution);
            if (!solution.success || isNaN(solution.value)) {
                console.error(`Solution at testcase[${i}] could not be converted to float!: ${t[1].solution}`);
                return;
            }
            
            if (result.success !== ParseStatus.SUCCESS || !sameFloat(result.value, solution.value)) {
                console.error(`Failed at testcase[${i}]: ${t[0]} : ${result.success} : ${result.value}`);
                return;
            } else {
                console.log(`PASSED: ${t[0]} = ${t[1].solution}`);
            }
        }
        else {
            if (result.success !== ParseStatus.INVALID_EXPRESSION) {
                console.error(`Failed to detect an invalid expression by parseExpression: ${result.success}`);
                return;
            } else {
                console.log(`PASSED: ${t[0]} is invalid`);
            }
        }
    }
    console.log("Every testcase is passed!");
}
