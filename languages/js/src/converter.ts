import { EMBEDDED_LISTS } from './embedded-lists.js';
import { nfc, caseFold, isLetterOrMark, charCount } from './unicode.js';
import { TallmanError } from './tallman-error.js';

function getList(listId: string) {
  const list = Object.hasOwn(EMBEDDED_LISTS, listId) ? EMBEDDED_LISTS[listId] : undefined;
  if (list === undefined) {
    const available = Object.keys(EMBEDDED_LISTS).sort().join(', ');
    throw new TallmanError(`Unknown Tallman list ID: '${listId}'. Available lists: ${available}.`);
  }
  return list;
}

export function toTallman(text: string, listId: string = 'DEFAULT'): string {
  if (!text) return '';

  const normalized = nfc(text);
  const { entries, maxWords } = getList(listId);

  let result = '';
  let i = 0;
  const n = normalized.length;

  while (i < n) {
    if (isLetterOrMark(normalized, i)) {
      // Extract the contiguous letter/mark word.
      const wordStart = i;
      while (i < n && isLetterOrMark(normalized, i)) {
        i += charCount(normalized, i);
      }
      const word = normalized.slice(wordStart, i);

      // Single-word match attempt.
      const wordKey = caseFold(word);
      let bestMatch: string | undefined = Object.hasOwn(entries, wordKey)
        ? entries[wordKey]
        : undefined;
      let bestEnd = i;

      // Greedy multi-word lookahead — bounded by per-list maxWords.
      // Separators: space ' ' and hyphen '-' only (spec section 3.4).
      let look = i;
      let wordsInPattern = 1;
      let pattern = word;

      while (wordsInPattern < maxWords && look < n) {
        const sep = normalized[look];
        if (sep !== ' ' && sep !== '-') break;
        pattern += sep;
        look++;

        if (look < n && isLetterOrMark(normalized, look)) {
          const nextWordStart = look;
          while (look < n && isLetterOrMark(normalized, look)) {
            look += charCount(normalized, look);
          }
          pattern += normalized.slice(nextWordStart, look);
          wordsInPattern++;

          const multiKey = caseFold(pattern);
          const multiMatch = Object.hasOwn(entries, multiKey) ? entries[multiKey] : undefined;
          if (multiMatch !== undefined) {
            bestMatch = multiMatch;
            bestEnd = look;
          }
        } else {
          break;
        }
      }

      result += bestMatch ?? word;
      i = bestEnd;
    } else {
      // Non-letter: copy verbatim, handling surrogate pairs correctly.
      const cp = normalized.codePointAt(i) ?? 0;
      result += String.fromCodePoint(cp);
      i += cp > 0xffff ? 2 : 1;
    }
  }

  return result;
}

export function availableLists(): ReadonlyArray<string> {
  return Object.keys(EMBEDDED_LISTS).sort();
}

export function listVersion(listId: string): string {
  return getList(listId).version;
}
