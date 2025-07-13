// Emoji encoding system for encrypted messages

export class EmojiEncoder {
  private static readonly EMOJI_SETS = {
    faces: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
    ],
    animals: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
      "🐦",
    ],
    nature: [
      "🌸",
      "🌺",
      "🌻",
      "🌷",
      "🌹",
      "🥀",
      "🌾",
      "🌿",
      "🍀",
      "🍃",
      "🌳",
      "🌲",
      "🌴",
      "🌱",
      "🌵",
      "🌰",
    ],
    food: [
      "🍎",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
    ],
    objects: [
      "⚡",
      "🔥",
      "💧",
      "❄️",
      "☀️",
      "🌙",
      "⭐",
      "✨",
      "💫",
      "💎",
      "🔮",
      "🎭",
      "🎨",
      "🎪",
      "🎯",
      "🎲",
    ],
    symbols: [
      "💚",
      "💙",
      "💜",
      "🧡",
      "❤️",
      "🖤",
      "🤍",
      "💕",
      "💖",
      "💗",
      "💘",
      "💝",
      "💞",
      "💟",
      "❣️",
      "💔",
    ],
  };

  private static readonly ALL_EMOJIS = Object.values(this.EMOJI_SETS).flat();

  static encodeToEmojis(base64Data: string): string {
    const bytes = this.base64ToBytes(base64Data);
    const emojis: string[] = [];

    for (const byte of bytes) {
      // Map each byte to two emojis to preserve all 256 possible values
      const firstEmoji =
        this.ALL_EMOJIS[Math.floor(byte / this.ALL_EMOJIS.length)];
      const secondEmoji = this.ALL_EMOJIS[byte % this.ALL_EMOJIS.length];
      emojis.push(firstEmoji, secondEmoji);
    }

    return emojis.join("");
  }

  static decodeFromEmojis(emojiString: string): string {
    const emojis = this.splitEmojis(emojiString);

    if (emojis.length % 2 !== 0) {
      throw new Error(
        "Invalid emoji sequence: must have even number of emojis",
      );
    }

    const bytes: number[] = [];

    for (let i = 0; i < emojis.length; i += 2) {
      const firstEmoji = emojis[i];
      const secondEmoji = emojis[i + 1];

      const firstIndex = this.ALL_EMOJIS.indexOf(firstEmoji);
      const secondIndex = this.ALL_EMOJIS.indexOf(secondEmoji);

      if (firstIndex === -1) {
        throw new Error(`Invalid emoji in encrypted message: ${firstEmoji}`);
      }
      if (secondIndex === -1) {
        throw new Error(`Invalid emoji in encrypted message: ${secondEmoji}`);
      }

      // Reconstruct the original byte value
      const originalByte = firstIndex * this.ALL_EMOJIS.length + secondIndex;
      bytes.push(originalByte);
    }

    return this.bytesToBase64(new Uint8Array(bytes));
  }

  static createVisualGroups(
    emojiString: string,
    groupSize: number = 8,
  ): string[] {
    const emojis = this.splitEmojis(emojiString);
    const groups: string[] = [];

    for (let i = 0; i < emojis.length; i += groupSize) {
      groups.push(emojis.slice(i, i + groupSize).join(""));
    }

    return groups;
  }

  static getEmojiCategories(): Record<string, string[]> {
    return this.EMOJI_SETS;
  }

  static generateRandomEmojis(count: number): string {
    const emojis: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * this.ALL_EMOJIS.length);
      emojis.push(this.ALL_EMOJIS[randomIndex]);
    }
    return emojis.join("");
  }

  private static base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  private static bytesToBase64(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static splitEmojis(str: string): string[] {
    // Fallback emoji splitting for TypeScript compatibility
    try {
      // @ts-ignore - Intl.Segmenter is not fully supported in all TypeScript versions
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      // @ts-ignore
      return Array.from(segmenter.segment(str), (s) => s.segment);
    } catch {
      // Fallback: simple character splitting (may not handle complex emojis perfectly)
      return [...str];
    }
  }

  static estimateEmojiCount(textLength: number): number {
    // Rough estimation based on base64 encoding and encryption overhead
    const base64Length = Math.ceil((textLength * 4) / 3);
    const encryptionOverhead = 48; // IV + salt + some padding
    // Each byte becomes 2 emojis in our new system
    return (base64Length + encryptionOverhead) * 2;
  }
}
