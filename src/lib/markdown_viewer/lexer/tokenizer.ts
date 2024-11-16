import { HeaderWeight, Token, TokenKind } from "../token";
import { Lexer } from "./lexer";

export function tokenizer(source: string): Token[] {
    const lexer = new Lexer(source);
    const tokens = readTokensAt(lexer, () => lexer.isEOF());
    return tokens;
}

function readTokensAt(lexer: Lexer, shouldEnd: (t: Token) => boolean): Token[] {
    const tokens = new Array<Token>();

    let currentToken: Token;
    do {
        currentToken = nextToken(lexer);
        if (tokens.length > 0 && currentToken.kind === TokenKind.TEXT) {
            const lastToken = tokens[tokens.length - 1];
            if (lastToken.kind === TokenKind.TEXT) {
                lastToken.content += currentToken.content;
                tokens[tokens.length - 1] = lastToken;
            } else tokens.push(currentToken);
        } else tokens.push(currentToken);
    } while (!shouldEnd(currentToken));

    return tokens;
}

function nextToken(lexer: Lexer): Token {
    if (lexer.isEOF()) return { kind: TokenKind.EOF };

    if (lexer.isNewLine) {
        const token = tryToReadNewLine(lexer);
        if (token) return token;
    }

    switch (lexer.peekChar()) {
        case "#": return readHeader(lexer);
        case "[": return readLink(lexer);
        case "!": return readImage(lexer);
        case "*": case "_": return readTextDecorator(lexer);
        case "`": return readCode(lexer);
        case "\n":
            lexer.readChar();
            return { kind: TokenKind.NL };
        default:
            return { kind: TokenKind.TEXT, content: lexer.readChar() };
    }
}

function readHeader(lexer: Lexer): Token {
    let weight = 0;

    do {
        weight++;
        lexer.readChar();
    } while (lexer.peekChar() === "#");

    const content = readTokensAt(lexer, (token) => token.kind === TokenKind.NL || token.kind === TokenKind.EOF);
    content.pop();

    return {
        kind: TokenKind.HEADER,
        weight: Math.max(Math.min(weight, 6), 0) as HeaderWeight,
        content: content
    };
}

function readLink(lexer: Lexer): Token {
    let fullContent = lexer.readChar()

    let content = "";
    while (!lexer.isEOF() && lexer.peekChar() !== "]" && lexer.peekChar() !== "\n") {
        content += lexer.readChar();
    }

    fullContent += content;
    if (lexer.peekChar() !== "]") return { kind: TokenKind.TEXT, content: fullContent };
    fullContent += lexer.readChar();
    if (lexer.peekChar() !== "(") return { kind: TokenKind.TEXT, content: fullContent };
    fullContent += lexer.readChar();


    let url = "";
    while (!lexer.isEOF() && lexer.peekChar() !== ")" && lexer.peekChar() !== "\n") {
        url += lexer.readChar();
    }

    fullContent += url;
    if (lexer.peekChar() !== ")") return { kind: TokenKind.TEXT, content: fullContent };
    fullContent += lexer.readChar();

    return { kind: TokenKind.LINK, url, content };
}

function readImage(lexer: Lexer): Token {
    let fullContent = lexer.readChar()
    if (lexer.peekChar() !== "[") return { kind: TokenKind.TEXT, content: fullContent };

    const token = readLink(lexer);
    if (token.kind === TokenKind.TEXT) fullContent += token.content;
    else if (token.kind === TokenKind.LINK) return { kind: TokenKind.IMG, url: token.url, content: token.content };

    return { kind: TokenKind.TEXT, content: fullContent }
}

function readTextDecorator(lexer: Lexer): Token {
    let specialChar = lexer.readChar();
    const token = lexer.peekChar() === specialChar ? readBold(lexer, specialChar) : readItalic(lexer, specialChar);

    if (token.kind == TokenKind.TEXT) return { kind: TokenKind.TEXT, content: specialChar + token.content};
    return token;
}

function readBold(lexer: Lexer, specialChar: string): Token {
    let fullContent = lexer.readChar();

    let content = "";
    let lastChar = "";
    while (!lexer.isEOF() && !(lexer.peekChar() === specialChar && lastChar === specialChar) && lexer.peekChar() !== "\n") {
        lastChar = lexer.readChar();
        content += lastChar;
    }

    if (lexer.peekChar() === specialChar && lastChar === specialChar) {
        while (!lexer.isEOF() && lexer.peekChar() === specialChar) {
            content += lexer.readChar();
        }
        content = content.substring(0, content.length - 2);
        const tokens = tokenizer(content);
        return { kind: TokenKind.BOLD, content: tokens };
    }

    fullContent += content + lexer.readChar();
    return { kind: TokenKind.TEXT, content: fullContent };
}

function readItalic(lexer: Lexer, specialChar: string): Token {
    let content = "";
    while (!lexer.isEOF() && lexer.peekChar() !== specialChar && lexer.peekChar() !== "\n") {
        content += lexer.readChar();
    }

    if (lexer.peekChar() === specialChar) {
        lexer.readChar();
        const tokens = tokenizer(content);
        return { kind: TokenKind.ITALIC, content: tokens };
    }

    content += lexer.readChar();
    return { kind: TokenKind.TEXT, content: content };
}

function readCode(lexer: Lexer): Token {
    let fullContent = lexer.readChar();

    let content = "";
    while (!lexer.isEOF() && lexer.peekChar() !== "`" && lexer.peekChar() !== "\n") {
        content += lexer.readChar();
    }

    if (lexer.peekChar() === "`") {
        lexer.readChar();
        console.log("teste")
        return { kind: TokenKind.CODE, content };
    }

    fullContent += content + lexer.readChar();
    return { kind: TokenKind.TEXT, content: content };
}

function tryToReadNewLine(lexer: Lexer): Token | undefined {
    lexer.save();

    if (lexer.peekChar() === "-" || lexer.peekChar() === "*" || lexer.peekChar() === "_") {
        let content = lexer.readChar();
        while (!lexer.isEOF() && lexer.peekChar() === content[0]) {
            content += lexer.readChar();
        }

        if ((lexer.isEOF() || lexer.peekChar() === "\n") && content.length >= 3) {
            return { kind: TokenKind.HLINE };
        }
    }

    lexer.restore();
    return undefined;
}