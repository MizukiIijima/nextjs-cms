const MARKDOWN_ESCAPED_CHARACTERS = new Set([
  "\\",
  "`",
  "*",
  "_",
  "{",
  "}",
  "[",
  "]",
  "(",
  ")",
  "#",
  "+",
  "-",
  ".",
  "!",
  "<",
  ">",
  "=",
]);

function restoreCode(code: string) {
  let lines = code.replace(/\r\n?/g, "\n").split("\n");

  while (lines[0]?.trim() === "") {
    lines.shift();
  }

  while (lines.at(-1)?.trim() === "") {
    lines.pop();
  }

  lines = lines.map((line) =>
    line
      .replace(/\\(.)/g, (escaped, character: string) =>
        MARKDOWN_ESCAPED_CHARACTERS.has(character) ? character : escaped,
      )
      .replace(/&#x20;|&#32;|&nbsp;/gi, " ")
      .replaceAll("\u00a0", " "),
  );

  const nonEmptyLineCount = lines.filter((line) => line.trim() !== "").length;
  const separatorCount = lines.filter(
    (line, index) =>
      line.trim() === "" &&
      lines[index - 1]?.trim() !== "" &&
      lines[index + 1]?.trim() !== "",
  ).length;

  if (
    separatorCount >= 1 &&
    separatorCount >= Math.floor((nonEmptyLineCount - 1) * 0.6)
  ) {
    lines = lines.filter((line) => line.trim() !== "");
  }

  return lines.join("\n");
}

export function normalizeEscapedCodeBlocks(markdown: string) {
  const newline = markdown.includes("\r\n") ? "\r\n" : "\n";

  return markdown.replace(
    /^\\`\\`\\`([\w-]*)[ \t]*\r?\n([\s\S]*?)^\\`\\`\\`[ \t]*\r?$/gm,
    (_match, language: string, code: string) =>
      [
        `\`\`\`${language}`,
        restoreCode(code).replaceAll("\n", newline),
        "\`\`\`",
      ].join(newline),
  );
}
