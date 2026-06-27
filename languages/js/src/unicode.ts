export function nfc(text: string): string {
  return text.normalize('NFC');
}

// Canonical fold per spec 3.2: toLowerCase(NFC(word)).
// All list entries are ASCII-only (validator-enforced), so toLowerCase()
// equals Unicode Default Case Folding within the ASCII range.
// Do NOT use toLocaleLowerCase() — locale-sensitive folding is not deterministic.
export function caseFold(word: string): string {
  return word.toLowerCase();
}

// Hoisted to module scope so it is compiled once, not per-call (hot path).
const LETTER_OR_MARK = /^[\p{L}\p{M}]$/u;

// Returns true if the character at index i (UTF-16 position) is a Unicode
// letter (category L*) or combining mark (category M*), matching \p{L}\p{M}.
export function isLetterOrMark(str: string, i: number): boolean {
  const cp = str.codePointAt(i);
  if (cp === undefined) return false;
  const char = String.fromCodePoint(cp);
  return LETTER_OR_MARK.test(char);
}

// Returns the number of UTF-16 code units consumed by the character at index i.
// Necessary for correct traversal when the string contains supplementary characters.
export function charCount(str: string, i: number): number {
  const cp = str.codePointAt(i);
  return cp !== undefined && cp > 0xffff ? 2 : 1;
}
