import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from "node-html-markdown";
import striptags from "striptags";

export function strip(string: string) {
    return striptags(string, ["br"])
        .replaceAll("<br>", "\n")
        .replaceAll("<br />", "\n");
}

export function toMarkdown(string: string) {
    const text = striptags(string, ["br", "a"]);
    const md = NodeHtmlMarkdown.translate(text);
    return md;
}
