export class Lexer {
    public source: string;
    private index: number;
    private length: number;
    public isNewLine: boolean = true;

    private savedIndex: number;
    private savedIsNewLine: boolean = true;
    
    constructor(source: string) {
        this.source = source;
        this.index = 0;
        this.savedIndex = 0;
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
        const char = this.source[this.index++];
        this.isNewLine = char === "\n";
        return char;
    }

    public consumeWhiteSpaces() {
        let currChar = this.peekChar();
        while (!this.isEOF() && currChar !== "\n" && currChar.trim() === "") {
            this.readChar();
            currChar = this.peekChar();
        }
    }

    public save() {
        this.savedIndex = this.index;
        this.savedIsNewLine = this.isNewLine;
    }

    public restore() {
        this.index = this.savedIndex;
        this.isNewLine = this.savedIsNewLine;
    }
}
