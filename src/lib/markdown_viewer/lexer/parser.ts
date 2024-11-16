import { Token, TokenKind } from "../token";

export function parseTokens(tokens: Token[]): string {
    return tokens.map(token => parseToken(token)).join("\n");
}

function parseToken(token: Token): string {
    switch (token.kind) {
        case TokenKind.NL: return "<br>";
        case TokenKind.EOF: return "";
        case TokenKind.TEXT: return token.content.trim();
        case TokenKind.LINK: return `<a href="${token.url}" target="_blank">${token.content}</a>`;
        case TokenKind.IMG: return `<img src="${token.url}" alt="${token.content}">`;
        case TokenKind.HEADER: return `<h${token.weight}>${parseTokens(token.content)}</h${token.weight}>`;
        case TokenKind.ITALIC: return `<i>${parseTokens(token.content)}</i>`;
        case TokenKind.BOLD: return `<strong>${parseTokens(token.content)}</strong>`;
    }
}
