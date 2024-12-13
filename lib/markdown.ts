export function formatMarkdown(content: string): string {
  if (!content) return "";

  return content
    .replace(/^>>(.*)/gm, '<blockquote class="text-lg">$1</blockquote>')
    .replace(/^- (.*$)/gm, '<span class="block text-base">- $1</span>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 class="text-base font-medium">$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5 class="text-sm font-medium">$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6 class="text-xs font-medium">$1</h6>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/^\* (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
    .replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul class="list-inside">$1</ul>')
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="cursor-pointer">$1</a>'
    )
    .replace(
      /\|(.+?)\|\n\|(-+\|)+\n((\|.+?\|\n)+)/g,
      (match, headerRow, separator, bodyRows) => {
        const headers = headerRow
          .split("|")
          .filter((h: string) => h.trim() !== "")
          .map((h: string) => `<th class="px-4 py-2 border">${h.trim()}</th>`)
          .join("");
        const rows = bodyRows
          .trim()
          .split("\n")
          .map((row: string) => {
            const cols = row
              .split("|")
              .filter((col: string) => col.trim() !== "")
              .map((col: string) => `<td class="px-4 py-2 border">${col.trim()}</td>`)
              .join("");
            return `<tr>${cols}</tr>`;
          })
          .join("");
        return (
          `<table class="table-auto border-collapse border border-gray-300 my-4 w-full">` +
          `<thead><tr>${headers}</tr></thead>` +
          `<tbody>${rows}</tbody>` +
          `</table>`
        );
      }
    )
    .split("\n\n")
    .map((p) => (p.trim() ? `<p>${p}</p>` : ""))
    .join("");
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}
