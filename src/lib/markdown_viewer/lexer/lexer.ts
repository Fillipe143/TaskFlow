export class Lexer {
    public source: string;
    private index: number;
    private length: number;

    constructor(source: string) {
        this.source = source;
        this.index = 0;
        this.length = source.length;
    }

    public isEOF(): boolean {
        return this.index >= this.length;
    }

    public peekChar(): string {
        if (this.isEOF()) return "";
        return this.source[this.index];
    }

    public readChar(): string {
        if (this.isEOF()) return "";
        return this.source[this.index++];
    }

    public consumeWhiteSpaces() {
        let currChar = this.peekChar();
        while (!this.isEOF() && currChar !== "\n" && currChar.trim() === "") {
            this.readChar();
            currChar = this.peekChar();
        }
    }
}
