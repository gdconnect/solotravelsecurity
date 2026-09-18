/**
 * Client-Side Zero-Knowledge Encryption (Web Crypto API)
 * Encrypts sensitive emergency payloads using AES-GCM (256-bit).
 * Decryption key is exported to URL-safe base64 for hash fragment (#key=...) sharing.
 */

export interface EncryptedPackage {
  encryptedPayload: string; // JSON serialized { iv: number[], ciphertext: number[] }
  secretKeyFragment: string; // #key=... for URL hash fragment
}

export async function encryptZeroKnowledgePayload(
  data: Record<string, unknown>,
): Promise<EncryptedPackage> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Web Crypto API is only available in browser environments");
  }

  const key = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );

  const exportedKey = await window.crypto.subtle.exportKey("raw", key);
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const payloadObj = {
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(ciphertextBuffer)),
  };

  return {
    encryptedPayload: JSON.stringify(payloadObj),
    secretKeyFragment: `#key=${keyBase64}`,
  };
}

export async function decryptZeroKnowledgePayload(
  encryptedPayloadString: string,
  keyBase64Fragment: string,
): Promise<Record<string, unknown>> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Web Crypto API is only available in browser environments");
  }

  // Remove leading #key= or #
  const cleanKey = keyBase64Fragment.replace(/^#?(key=)?/, "");
  // Restore base64 padding
  let base64 = cleanKey.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  const binaryString = atob(base64);
  const keyBytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    keyBytes[i] = binaryString.charCodeAt(i);
  }

  const key = await window.crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  const payload = JSON.parse(encryptedPayloadString) as {
    iv: number[];
    ciphertext: number[];
  };

  const iv = new Uint8Array(payload.iv);
  const ciphertext = new Uint8Array(payload.ciphertext);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );

  const decryptedString = new TextDecoder().decode(decryptedBuffer);
  return JSON.parse(decryptedString) as Record<string, unknown>;
}
