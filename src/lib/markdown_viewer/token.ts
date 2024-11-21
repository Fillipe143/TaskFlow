export enum TokenKind {
    NL = "new line",
    EOF = "end of file",
    HLINE = "horizontal line",
    TEXT = "text",
    HEADER = "header",
    LINK = "link",
    IMG = "image",
    ITALIC = "italic",
    BOLD = "bold",
    CODE = "code"
};

export type HeaderWeight = 1 | 2 | 3 | 4 | 5;

export type Token =
    | { kind: TokenKind.NL; }
    | { kind: TokenKind.EOF; }
    | { kind: TokenKind.HLINE; }
    | { kind: TokenKind.TEXT; content: string }
    | { kind: TokenKind.HEADER; weight: HeaderWeight; content: Token[]; }
    | { kind: TokenKind.LINK; url: string; content: string; }
    | { kind: TokenKind.IMG; url: string; content: string; }
    | { kind: TokenKind.ITALIC; content: Token[]; }
    | { kind: TokenKind.BOLD; content: Token[]; }
    | { kind: TokenKind.CODE; content: string };
