// Encryption/decryption utilities for secure text messaging

export interface EncryptedMessage {
  ciphertext: ArrayBuffer;
  iv: ArrayBuffer;
  salt: ArrayBuffer;
}

export class SecureTextCrypto {
  static async encryptText(
    text: string,
    key: CryptoKey,
  ): Promise<EncryptedMessage> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const iv = new Uint8Array(12);
    crypto.getRandomValues(iv);

    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);

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

  static async decryptText(
    encryptedMessage: EncryptedMessage,
    key: CryptoKey,
  ): Promise<string> {
    try {
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
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  static encryptedMessageToBase64(encryptedMessage: EncryptedMessage): string {
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

  static base64ToEncryptedMessage(base64: string): EncryptedMessage {
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

  static generateSecureId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  }
}
