// WebAuthn passkey utilities for encryption/decryption app

export interface PasskeyCredential {
  id: string;
  publicKey: ArrayBuffer;
  algorithm: string;
}

export class PasskeyManager {
  private static readonly RP_NAME = "SecureText";

  private static getRP_ID(): string | undefined {
    const hostname = window.location.hostname;

    // For localhost, don't set RP_ID
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return undefined;
    }

    // For complex subdomains (like fly.dev), try to use the hostname directly
    // but if it fails, we'll try without RP_ID
    return hostname;
  }

  static async isSupported(): Promise<boolean> {
    try {
      // Check basic WebAuthn support
      if (!window.PublicKeyCredential) {
        console.log("PublicKeyCredential not available");
        return false;
      }

      // Check if the feature is available
      if (
        !window.PublicKeyCredential
          .isUserVerifyingPlatformAuthenticatorAvailable
      ) {
        console.log(
          "isUserVerifyingPlatformAuthenticatorAvailable not available",
        );
        return false;
      }

      // Test if we can actually access the API
      try {
        const available =
          await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        console.log("Platform authenticator available:", available);
        return available;
      } catch (error) {
        // If the check fails, still try to support it - some browsers have quirks
        console.warn(
          "Platform authenticator check failed, but continuing:",
          error,
        );
        return true; // Allow attempting to use passkeys anyway
      }
    } catch (error) {
      console.warn("WebAuthn support check failed:", error);
      return false;
    }
  }

  static async createPasskey(username: string): Promise<PasskeyCredential> {
    console.log("Creating passkey for username:", username);
    console.log("RP_ID:", this.getRP_ID());

    // Don't block on support check - let the browser decide
    const isSupported = await this.isSupported();
    console.log("Passkey support check result:", isSupported);

    if (!isSupported) {
      console.warn(
        "Passkey support check failed, but attempting creation anyway",
      );
    }

    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const userId = new TextEncoder().encode(username);

    const rpId = this.getRP_ID();
    console.log("Using RP_ID:", rpId);

    const createCredentialDefaultArgs: CredentialCreationOptions = {
      publicKey: {
        rp: {
          name: this.RP_NAME,
          ...(rpId && { id: rpId }),
        },
        user: {
          id: userId,
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        challenge,
        timeout: 60000,
        attestation: "none",
      },
    };

    // Try with RP_ID first
    try {
      console.log("Attempting passkey creation with full config...");
      const credential = (await navigator.credentials.create(
        createCredentialDefaultArgs,
      )) as PublicKeyCredential;

      if (!credential) {
        throw new Error("Failed to create passkey");
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      return {
        id: credential.id,
        publicKey: response.getPublicKey()!,
        algorithm: "ES256",
      };
    } catch (error: any) {
      console.warn("First attempt failed:", error);

      // If the first attempt fails, try without RP_ID
      if (
        rpId &&
        (error.name === "SecurityError" || error.name === "NotAllowedError")
      ) {
        console.log("Retrying without RP_ID...");

        const fallbackArgs: CredentialCreationOptions = {
          publicKey: {
            rp: {
              name: this.RP_NAME,
              // No ID this time
            },
            user: {
              id: userId,
              name: username,
              displayName: username,
            },
            pubKeyCredParams: [
              { alg: -7, type: "public-key" }, // ES256
              { alg: -257, type: "public-key" }, // RS256
            ],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required",
              residentKey: "preferred",
            },
            challenge,
            timeout: 60000,
            attestation: "none",
          },
        };

        try {
          const credential = (await navigator.credentials.create(
            fallbackArgs,
          )) as PublicKeyCredential;

          if (!credential) {
            throw new Error("Failed to create passkey");
          }

          const response =
            credential.response as AuthenticatorAttestationResponse;

          return {
            id: credential.id,
            publicKey: response.getPublicKey()!,
            algorithm: "ES256",
          };
        } catch (fallbackError: any) {
          console.error("Fallback attempt also failed:", fallbackError);
          // Use original error for user message
        }
      }

      // Handle specific error types
      if (error.name === "NotAllowedError") {
        if (error.message.includes("publickey-credentials-create")) {
          throw new Error(
            "WebAuthn is blocked by browser permissions. This can happen with certain domain configurations. Try using a different browser or device.",
          );
        }
        throw new Error(
          "Passkey creation was cancelled or blocked. Please ensure you're using a supported browser and device.",
        );
      }
      if (error.name === "NotSupportedError") {
        throw new Error(
          "Your device doesn't support passkeys. Please try using a device with biometric authentication.",
        );
      }
      if (error.name === "SecurityError") {
        throw new Error(
          "Security error creating passkey. This can happen with certain domain configurations. Try using localhost or a different domain.",
        );
      }
      throw new Error(`Failed to create passkey: ${error.message || error}`);
    }
  }

  static async authenticateWithPasskey(
    credentialId?: string,
  ): Promise<ArrayBuffer> {
    if (!(await this.isSupported())) {
      throw new Error("Passkeys are not supported on this device");
    }

    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const getCredentialDefaultArgs: CredentialRequestOptions = {
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "required",
        allowCredentials: credentialId
          ? [
              {
                type: "public-key",
                id: this.base64urlToArrayBuffer(credentialId),
              },
            ]
          : [],
      },
    };

    try {
      const credential = (await navigator.credentials.get(
        getCredentialDefaultArgs,
      )) as PublicKeyCredential;

      if (!credential) {
        throw new Error("Authentication failed");
      }

      const response = credential.response as AuthenticatorAssertionResponse;
      return response.signature;
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        throw new Error(
          "Authentication was cancelled or blocked. Please try again.",
        );
      }
      if (error.name === "InvalidStateError") {
        throw new Error(
          "Passkey not found. Please create a new passkey or try a different one.",
        );
      }
      throw new Error(`Authentication failed: ${error.message || error}`);
    }
  }

  static arrayBufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  static base64urlToArrayBuffer(base64url: string): ArrayBuffer {
    const binary = atob(base64url.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  static async deriveEncryptionKey(
    signature: ArrayBuffer,
    salt?: Uint8Array,
  ): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      signature,
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"],
    );

    const usedSalt = salt || new Uint8Array(16);
    if (!salt) {
      crypto.getRandomValues(usedSalt);
    }

    return crypto.subtle.deriveKey(
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
  }
}
