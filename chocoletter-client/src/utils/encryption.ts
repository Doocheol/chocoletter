/**
 * encryption.ts
 *
 * 이 모듈은 클라이언트 측 엔드투엔드 암호화를 위해 작성되었습니다.
 * 여기서는 고정된 IV를 사용하여 AES-GCM 방식으로 암호화를 수행합니다.
 * (주의: 고정 IV 사용은 암호문 패턴이 반복될 수 있으므로 추가 보안 조치가 필요합니다.)
 */

//////////////////////////
// Base64 변환 유틸리티 함수
//////////////////////////

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

//////////////////////////
// AES-GCM 대칭키 암호화/복호화 (고정 IV 방식)
//////////////////////////

// 고정된 12바이트 IV (예시: 모두 0인 배열)
export const FIXED_IV: Uint8Array = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

/**
 * AES-GCM 256비트 대칭키를 생성합니다.
 */
export async function generateSymmetricKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * 평문 메시지를 AES-GCM 대칭키와 고정 IV로 암호화합니다.
 * @param message 평문 문자열
 * @param key AES-GCM CryptoKey
 * @returns 암호문과 고정 IV를 반환합니다.
 */
export async function encryptMessage(
  message: string,
  key: CryptoKey
): Promise<{ cipherText: ArrayBuffer; iv: Uint8Array }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  // 고정된 IV 사용
  const cipherText = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: FIXED_IV },
    key,
    data
  );

  return { cipherText, iv: FIXED_IV };
}

/**
 * 암호문을 AES-GCM 대칭키와 고정 IV를 사용하여 복호화합니다.
 * @param cipherText 암호문 ArrayBuffer
 * @param key AES-GCM CryptoKey
 * @param iv 고정 IV (여기서는 FIXED_IV)
 * @returns 복호화된 평문 문자열
 */
export async function decryptMessage(
  cipherText: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array
): Promise<string> {
  const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipherText);
  return new TextDecoder().decode(decrypted);
}

//////////////////////////
// RSA-OAEP를 이용한 대칭키 암호화/복호화
//////////////////////////

/**
 * RSA-OAEP를 이용해 대칭키를 암호화합니다.
 * @param symmetricKey 암호화할 AES-GCM 대칭키
 * @param publicKey 수신자의 RSA-OAEP 공개키
 * @returns 암호화된 대칭키(Base64 문자열)
 */
export async function encryptSymmetricKeyWithPublicKey(
  symmetricKey: CryptoKey,
  publicKey: CryptoKey
): Promise<string> {
  const rawKey = await window.crypto.subtle.exportKey("raw", symmetricKey);
  const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawKey
  );
  return arrayBufferToBase64(encryptedKeyBuffer);
}

/**
 * RSA-OAEP를 이용해 암호화된 대칭키를 복호화합니다.
 * @param encryptedKeyBase64 암호화된 대칭키 (Base64 문자열)
 * @param privateKey 수신자의 RSA-OAEP 개인키
 * @returns 복원된 AES-GCM 대칭키 (CryptoKey)
 */
export async function decryptSymmetricKeyWithPrivateKey(
  encryptedKeyBase64: string,
  privateKey: CryptoKey
): Promise<CryptoKey> {
  const encryptedKeyBuffer = base64ToArrayBuffer(encryptedKeyBase64);
  const rawKey = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedKeyBuffer
  );
  return window.crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, true, [
    "encrypt",
    "decrypt",
  ]);
}
