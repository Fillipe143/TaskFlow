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

    switch (lexer.peekChar()) {
        case "#": return readHeader(lexer);
        case "[": return readLink(lexer);
        case "!": return readImage(lexer);
        case "*": return readTextDecorator(lexer);
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
        weight: Math.max(Math.min(weight, 5), 0) as HeaderWeight,
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
    return { kind: TokenKind.TEXT, content: "" };
}
