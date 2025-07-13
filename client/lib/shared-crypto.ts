// Shared password-based encryption system

export interface SharedEncryptedMessage {
  ciphertext: ArrayBuffer;
  iv: ArrayBuffer;
  salt: ArrayBuffer;
}

export class SharedCrypto {
  static async deriveKeyFromPassword(
    password: string,
    salt?: Uint8Array,
  ): Promise<{ key: CryptoKey; salt: Uint8Array }> {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);

    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordData,
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"],
    );

    // Use provided salt or generate new one
    const usedSalt = salt || new Uint8Array(16);
    if (!salt) {
      crypto.getRandomValues(usedSalt);
    }

    // Derive encryption key
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: usedSalt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );

    return { key, salt: usedSalt };
  }

  static async encryptWithPassword(
    text: string,
    password: string,
  ): Promise<SharedEncryptedMessage> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Derive key from password
    const { key, salt } = await this.deriveKeyFromPassword(password);

    // Generate random IV
    const iv = new Uint8Array(12);
    crypto.getRandomValues(iv);

    try {
      const ciphertext = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        data,
      );

      return {
        ciphertext,
        iv: iv.buffer,
        salt: salt.buffer,
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  static async decryptWithPassword(
    encryptedMessage: SharedEncryptedMessage,
    password: string,
  ): Promise<string> {
    try {
      // Derive key from password using the stored salt
      const { key } = await this.deriveKeyFromPassword(
        password,
        new Uint8Array(encryptedMessage.salt),
      );

      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: encryptedMessage.iv,
        },
        key,
        encryptedMessage.ciphertext,
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      throw new Error(`Decryption failed: Invalid password or corrupted data`);
    }
  }

  static encryptedMessageToBase64(
    encryptedMessage: SharedEncryptedMessage,
  ): string {
    const combined = new Uint8Array(
      encryptedMessage.salt.byteLength +
        encryptedMessage.iv.byteLength +
        encryptedMessage.ciphertext.byteLength,
    );

    combined.set(new Uint8Array(encryptedMessage.salt), 0);
    combined.set(
      new Uint8Array(encryptedMessage.iv),
      encryptedMessage.salt.byteLength,
    );
    combined.set(
      new Uint8Array(encryptedMessage.ciphertext),
      encryptedMessage.salt.byteLength + encryptedMessage.iv.byteLength,
    );

    let binary = "";
    for (let i = 0; i < combined.length; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
  }

  static base64ToEncryptedMessage(base64: string): SharedEncryptedMessage {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const salt = bytes.slice(0, 16).buffer;
    const iv = bytes.slice(16, 28).buffer;
    const ciphertext = bytes.slice(28).buffer;

    return { salt, iv, ciphertext };
  }

  static generateSecurePassword(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);

    for (let i = 0; i < 8; i++) {
      password += chars[array[i] % chars.length];
    }
    return password;
  }

  static validatePassword(password: string): {
    valid: boolean;
    message: string;
  } {
    // Check if password contains only letters and numbers
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      return {
        valid: false,
        message: "Password must contain only letters and numbers",
      };
    }

    if (password.length < 5) {
      return {
        valid: false,
        message: "Password must be at least 5 characters long",
      };
    }
    if (password.length > 8) {
      return {
        valid: false,
        message: "Password must be at most 8 characters long",
      };
    }
    return { valid: true, message: "Password is valid" };
  }
}
