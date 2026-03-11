/**
 * Latin → Georgian Mkhedruli transliteration engine.
 * Supports BGN/PCGN 2009 national system (apostrophe ejectives) + informal chat style.
 * Longest-match-first scanning ensures digraphs like "sh" aren't split into ს+ჰ.
 */

const GEORGIAN_REGEX = /[\u10A0-\u10FF]/;

export function containsGeorgian(text: string): boolean {
  return GEORGIAN_REGEX.test(text);
}

export function isPredominantlyGeorgian(text: string): boolean {
  let georgianCount = 0;
  let latinCount = 0;

  for (const char of text) {
    if (GEORGIAN_REGEX.test(char)) {
      georgianCount++;
    } else if (/[a-zA-Z]/.test(char)) {
      latinCount++;
    }
  }

  if (georgianCount === 0 && latinCount === 0) return false;
  return georgianCount > latinCount;
}

// Ordered by length descending — longer patterns MUST come first
const MULTI_CHAR_PATTERNS: readonly [string, string][] = [
  // 4-char
  ["tsch", "ჭ"],

  // 3-char: apostrophe ejectives (BGN/PCGN official)
  ["ch'", "ჭ"],
  ["ts'", "წ"],
  ["tch", "ჭ"],
  ["k'", "კ"],   // ejective k (vs ქ aspirated)
  ["p'", "პ"],   // ejective p (vs ფ aspirated)
  ["t'", "ტ"],   // ejective t (vs თ aspirated)
  ["q'", "ყ"],
  ["T'", "ტ"],
  ["K'", "კ"],
  ["P'", "პ"],
  ["Q'", "ყ"],

  // 2-char digraphs
  ["sh", "შ"],
  ["Sh", "შ"],
  ["SH", "შ"],
  ["zh", "ჟ"],
  ["Zh", "ჟ"],
  ["ZH", "ჟ"],
  ["ch", "ჩ"],
  ["Ch", "ჩ"],
  ["CH", "ჩ"],
  ["kh", "ხ"],
  ["Kh", "ხ"],
  ["KH", "ხ"],
  ["gh", "ღ"],
  ["Gh", "ღ"],
  ["GH", "ღ"],
  ["ts", "ც"],
  ["Ts", "ც"],
  ["TS", "ც"],
  ["dz", "ძ"],
  ["Dz", "ძ"],
  ["DZ", "ძ"],
  ["th", "თ"],
  ["Th", "თ"],
  ["TH", "თ"],
  ["ph", "ფ"],
  ["Ph", "ფ"],
  ["PH", "ფ"],
  ["jh", "ჟ"],
  ["Jh", "ჟ"],
  ["JH", "ჟ"],
];

// For ambiguous consonants: plain t/k = aspirated (თ/ქ), plain p = ejective (პ).
// Apostrophe variants: t'/k'/p' = ejective (ტ/კ/პ).
// In informal Georgian chat, "p" almost always means პ; ფ is reached via "ph" or "f".
// e.g. "tbilisi" → თბილისი, "t'bilisi" → ტბილისი, "portali" → პორთალი
const SINGLE_CHAR_MAP: Readonly<Record<string, string>> = {
  a: "ა", b: "ბ", g: "გ", d: "დ", e: "ე", v: "ვ", z: "ზ",
  t: "თ", i: "ი", k: "ქ", l: "ლ", m: "მ", n: "ნ", o: "ო",
  p: "პ", r: "რ", s: "ს", u: "უ",
  f: "ფ", // loanwords
  q: "ყ", x: "ხ", j: "ჯ", h: "ჰ",
  w: "წ", // QWERTY keyboard convention
  y: "ყ",
  c: "ც",

  A: "ა", B: "ბ", G: "გ", D: "დ", E: "ე", V: "ვ", Z: "ზ",
  T: "თ", I: "ი", K: "ქ", L: "ლ", M: "მ", N: "ნ", O: "ო",
  P: "პ", R: "რ", S: "ს", U: "უ",
  F: "ფ",
  Q: "ყ", X: "ხ", J: "ჯ", H: "ჰ",
  W: "წ",
  Y: "ყ",
  C: "ც",
};

// Normalize curly quotes, backticks, modifier letters to ASCII apostrophe
function normalizeApostrophes(text: string): string {
  return text.replace(/[\u2018\u2019\u02BC\u02BB\u0060\u00B4]/g, "'");
}

export function transliterate(text: string): string {
  if (isPredominantlyGeorgian(text)) {
    return text;
  }

  const normalized = normalizeApostrophes(text);
  const result: string[] = [];
  let i = 0;

  while (i < normalized.length) {
    if (GEORGIAN_REGEX.test(normalized[i])) {
      result.push(normalized[i]);
      i++;
      continue;
    }

    let matched = false;

    for (const [pattern, georgian] of MULTI_CHAR_PATTERNS) {
      if (i + pattern.length <= normalized.length) {
        const slice = normalized.slice(i, i + pattern.length);
        if (slice === pattern) {
          result.push(georgian);
          i += pattern.length;
          matched = true;
          break;
        }
      }
    }

    if (matched) continue;

    const mapped = SINGLE_CHAR_MAP[normalized[i]];
    if (mapped) {
      result.push(mapped);
      i++;
      continue;
    }

    result.push(normalized[i]);
    i++;
  }

  return result.join("");
}
