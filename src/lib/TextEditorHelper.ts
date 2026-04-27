//
// Function used to help markdown editor from scratch
//
export function formatOrderedList(
  text: string,
  selectionStart: number,
  selectionEnd: number,
): string {
  const selectedText = text.slice(selectionStart, selectionEnd);

  if (!selectedText) {
    return text.slice(0, selectionStart) + "\n1. " + text.slice(selectionEnd);
  }

  const lines = selectedText.split("\n");

  const formatted = lines.map((line, i) => `${i + 1}. ${line}`).join("\n");

  return text.slice(0, selectionStart) + formatted + text.slice(selectionEnd);
}

export function formatUnorderedList(
  text: string,
  selectionStart: number,
  selectionEnd: number,
): string {
  const selectedText = text.slice(selectionStart, selectionEnd);

  if (!selectedText) {
    return text.slice(0, selectionStart) + "\n- " + text.slice(selectionEnd);
  }

  const lines = selectedText.split("\n");

  const formatted = lines.map((line) => `- ${line}`).join("\n");

  return text.slice(0, selectionStart) + formatted + text.slice(selectionEnd);
}
