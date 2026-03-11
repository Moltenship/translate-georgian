import { describe, it, expect } from "vitest";
import {
  transliterate,
  containsGeorgian,
  isPredominantlyGeorgian,
} from "../src/transliterate.js";

describe("containsGeorgian", () => {
  it("detects Georgian characters", () => {
    expect(containsGeorgian("გამარჯობა")).toBe(true);
    expect(containsGeorgian("hello გ world")).toBe(true);
  });

  it("returns false for pure Latin", () => {
    expect(containsGeorgian("gamarjoba")).toBe(false);
    expect(containsGeorgian("hello world")).toBe(false);
  });
});

describe("isPredominantlyGeorgian", () => {
  it("returns true when majority is Georgian", () => {
    expect(isPredominantlyGeorgian("გამარჯობა")).toBe(true);
    expect(isPredominantlyGeorgian("გამარჯობა a")).toBe(true);
  });

  it("returns false when majority is Latin", () => {
    expect(isPredominantlyGeorgian("gamarjoba")).toBe(false);
    expect(isPredominantlyGeorgian("hello world")).toBe(false);
  });

  it("returns false for non-alphabetic text", () => {
    expect(isPredominantlyGeorgian("123 456")).toBe(false);
    expect(isPredominantlyGeorgian("")).toBe(false);
  });
});

describe("transliterate", () => {
  describe("common words and phrases", () => {
    it("converts gamarjoba", () => {
      expect(transliterate("gamarjoba")).toBe("გამარჯობა");
    });

    it("converts rogor khar", () => {
      expect(transliterate("rogor khar")).toBe("როგორ ხარ");
    });

    it("converts tbilisi", () => {
      expect(transliterate("tbilisi")).toBe("თბილისი");
    });

    it("converts saqartvelo", () => {
      expect(transliterate("saqartvelo")).toBe("საყართველო");
    });

    it("converts madloba", () => {
      expect(transliterate("madloba")).toBe("მადლობა");
    });

    it("converts gmadlobt", () => {
      expect(transliterate("gmadlobt")).toBe("გმადლობთ");
    });
  });

  describe("digraph handling", () => {
    it("handles sh → შ", () => {
      expect(transliterate("sheni")).toBe("შენი");
    });

    it("handles ch → ჩ", () => {
      expect(transliterate("chemi")).toBe("ჩემი");
    });

    it("handles kh → ხ", () => {
      expect(transliterate("khar")).toBe("ხარ");
    });

    it("handles gh → ღ", () => {
      expect(transliterate("ghvino")).toBe("ღვინო");
    });

    it("handles ts → ც", () => {
      expect(transliterate("tskheli")).toBe("ცხელი");
    });

    it("handles dz → ძ", () => {
      expect(transliterate("dzveli")).toBe("ძველი");
    });

    it("handles zh → ჟ", () => {
      expect(transliterate("zhurnali")).toBe("ჟურნალი");
    });

    it("handles th → თ", () => {
      expect(transliterate("thetri")).toBe("თეთრი");
    });

    it("handles ph → ფ", () => {
      expect(transliterate("phuli")).toBe("ფული");
    });
  });

  describe("ejective consonants (apostrophe)", () => {
    it("handles t' → ტ", () => {
      expect(transliterate("t'ba")).toBe("ტბა");
    });

    it("handles k' → კ", () => {
      expect(transliterate("k'ari")).toBe("კარი");
    });

    it("handles p' → პ", () => {
      expect(transliterate("p'uri")).toBe("პური");
    });

    it("handles ch' → ჭ", () => {
      expect(transliterate("ch'ama")).toBe("ჭამა");
    });

    it("handles ts' → წ", () => {
      expect(transliterate("ts'qali")).toBe("წყალი");
    });

    it("normalizes curly apostrophes", () => {
      expect(transliterate("t\u2019ba")).toBe("ტბა");
      expect(transliterate("k\u2018ari")).toBe("კარი");
      expect(transliterate("t\u02BCba")).toBe("ტბა");
    });
  });

  describe("case handling", () => {
    it("handles uppercase letters", () => {
      expect(transliterate("GAMARJOBA")).toBe("გამარჯობა");
    });

    it("handles mixed case digraphs", () => {
      expect(transliterate("Shen")).toBe("შენ");
      expect(transliterate("Khar")).toBe("ხარ");
    });

    it("handles fully uppercase digraphs", () => {
      expect(transliterate("SHeni")).toBe("შენი");
    });
  });

  describe("preserves non-transliterable content", () => {
    it("preserves digits", () => {
      expect(transliterate("2024 tseli")).toBe("2024 ცელი");
    });

    it("preserves punctuation", () => {
      expect(transliterate("gamarjoba!")).toBe("გამარჯობა!");
      expect(transliterate("rogor khar?")).toBe("როგორ ხარ?");
    });

    it("preserves spaces", () => {
      expect(transliterate("me var")).toBe("მე ვარ");
    });

    it("preserves emojis", () => {
      expect(transliterate("gamarjoba 😊")).toBe("გამარჯობა 😊");
    });
  });

  describe("Georgian text passthrough", () => {
    it("returns predominantly Georgian text unchanged", () => {
      const georgian = "გამარჯობა როგორ ხარ";
      expect(transliterate(georgian)).toBe(georgian);
    });

    it("returns pure Georgian unchanged", () => {
      const georgian = "მადლობა";
      expect(transliterate(georgian)).toBe(georgian);
    });
  });

  describe("informal shortcuts", () => {
    it("handles x → ხ", () => {
      expect(transliterate("xar")).toBe("ხარ");
    });

    it("handles w → წ", () => {
      expect(transliterate("wqali")).toBe("წყალი");
    });

    it("handles jh → ჟ", () => {
      expect(transliterate("jhurnali")).toBe("ჟურნალი");
    });

    it("handles tch → ჭ", () => {
      expect(transliterate("tchama")).toBe("ჭამა");
    });

    it("handles tsch → ჭ", () => {
      expect(transliterate("tschama")).toBe("ჭამა");
    });
  });

  describe("edge cases", () => {
    it("handles empty string", () => {
      expect(transliterate("")).toBe("");
    });

    it("handles single character", () => {
      expect(transliterate("a")).toBe("ა");
    });

    it("handles only punctuation", () => {
      expect(transliterate("!!!")).toBe("!!!");
    });

    it("handles only digits", () => {
      expect(transliterate("12345")).toBe("12345");
    });

    it("handles mixed Georgian and Latin", () => {
      expect(transliterate("ა b გ d")).toBe("ა ბ გ დ");
    });
  });
});
