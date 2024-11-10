import { tokenizer } from "./lexer/tokenizer";
import { parseTokens } from "./lexer/parser";

export function mdToHtml(source: string): string {
    return parseTokens(tokenizer(source));
}