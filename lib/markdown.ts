export function formatMarkdown(content: string): string {
  if (!content) return "";

  return content
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold my-3">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium my-2">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 class="text-base font-medium my-2">$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5 class="text-sm font-medium my-1">$1</h5>')
    .replace(
      /^###### (.*$)/gm,
      '<h6 class="text-xs font-medium my-1">$1</h6>'
    )
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/^\* (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
    .replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul class="list-inside">$1</ul>')
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="cursor-pointer">$1</a>'
    )
    .split("\n\n")
    .map((p) => (p.trim() ? `<p class="my-4">${p}</p>` : ""))
    .join("");
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}
