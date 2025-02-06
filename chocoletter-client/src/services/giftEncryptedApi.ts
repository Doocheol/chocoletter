import api from "./api";
import { getGiftBoxPublicKey } from "./keyApi";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  encryptFixedSymmetricKey,
  encryptMessageAES,
  FIXED_IV,
  getFixedSymmetricKey,
} from "../utils/encryption";
// 고정 대칭키 관련 모듈

/**
 * 내부 유틸: 상대방의 공개키(Base64 문자열)를 RSA-OAEP CryptoKey 객체로 변환합니다.
 *
 * @param publicKeyB64 - 상대방의 공개키 (Base64 문자열)
 * @returns 수신자 공개키 (CryptoKey)
 */
async function importRecipientPublicKey(publicKeyB64: string): Promise<CryptoKey> {
  const publicKeyBuffer = base64ToArrayBuffer(publicKeyB64);
  return window.crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

/**
 * 하이브리드 암호화를 이용한 일반 자유 선물 보내기 API (FixedSymmetricKey 버전)
 *
 * 1. 고정 대칭키를 가져옵니다.
 * 2. 평문 편지 내용을 AES‑GCM (고정 IV 사용) 방식으로 암호화합니다.
 * 3. 수신자의 공개키를 조회한 후, 그 공개키로 고정 대칭키를 암호화하여 encryptedKey를 생성합니다.
 * 4. 암호문(content)와 encryptedKey를 서버에 전송합니다.
 *
 * @param giftBoxId - 선물 박스 ID
 * @param nickName - 발신자 닉네임
 * @param plainContent - 평문 편지 내용
 */
export async function sendGeneralFreeGift(
  giftBoxId: string,
  nickName: string,
  plainContent: string
) {
  try {
    // 1. 고정 대칭키 가져오기
    const symmetricKey = await getFixedSymmetricKey();
    // 2. 평문 편지 내용을 AES‑GCM (고정 IV 사용)으로 암호화
    const encryptedBuffer = await encryptMessageAES(plainContent, symmetricKey);
    const encryptedContent = arrayBufferToBase64(encryptedBuffer);
    // 3. 수신자의 공개키(Base64 문자열) 조회 및 변환
    const recipientPublicKeyB64 = await getGiftBoxPublicKey(giftBoxId);
    const recipientPublicKey = await importRecipientPublicKey(recipientPublicKeyB64);
    // 4. 고정 대칭키를 수신자의 공개키로 암호화하여 encryptedKey 생성
    const encryptedKey = await encryptFixedSymmetricKey(recipientPublicKey);
    // 5. API 전송
    const res = await api.post(`/api/v1/gift-box/${giftBoxId}/gift/general/free`, {
      nickName,
      content: encryptedContent,
      encryptedKey,
    });
    return res.data;
  } catch (err) {
    console.error("sendGeneralFreeGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 하이브리드 암호화를 이용한 일반 질문 선물 보내기 API (FixedSymmetricKey 버전)
 *
 * 질문은 평문으로 전송되고, 편지 내용(답변)은 AES‑GCM (고정 IV 사용) 방식으로 암호화됩니다.
 *
 * @param giftBoxId - 선물 박스 ID
 * @param nickName - 발신자 닉네임
 * @param question - 질문 내용 (평문)
 * @param plainContent - 평문 편지 내용 (암호화 대상)
 */
export async function sendGeneralQuestionGift(
  giftBoxId: string,
  nickName: string,
  question: string,
  plainContent: string
) {
  try {
    const symmetricKey = await getFixedSymmetricKey();
    const encryptedBuffer = await encryptMessageAES(plainContent, symmetricKey);
    const encryptedContent = arrayBufferToBase64(encryptedBuffer);
    const recipientPublicKeyB64 = await getGiftBoxPublicKey(giftBoxId);
    const recipientPublicKey = await importRecipientPublicKey(recipientPublicKeyB64);
    const encryptedKey = await encryptFixedSymmetricKey(recipientPublicKey);
    const res = await api.post(`/api/v1/gift-box/${giftBoxId}/gift/general/question`, {
      nickName,
      question,
      answer: encryptedContent,
      encryptedKey,
    });
    return res.data;
  } catch (err) {
    console.error("sendGeneralQuestionGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 하이브리드 암호화를 이용한 특별 자유 선물 보내기 API (FixedSymmetricKey 버전)
 *
 * 평문 편지 내용을 AES‑GCM (고정 IV 사용)으로 암호화한 후, 고정 대칭키를 RSA-OAEP 방식으로 암호화한 결과(encryptedKey)
 * 와 함께 개봉 시간(unBoxingTime)을 서버에 전송합니다.
 *
 * @param giftBoxId - 선물 박스 ID
 * @param nickName - 발신자 닉네임
 * @param plainContent - 평문 편지 내용
 * @param unBoxingTime - 개봉 시간 (HH:mm 형식, 24시간제)
 */
export async function sendSpecialFreeGift(
  giftBoxId: string,
  nickName: string,
  plainContent: string,
  unBoxingTime: string
) {
  try {
    const symmetricKey = await getFixedSymmetricKey();
    const encryptedBuffer = await encryptMessageAES(plainContent, symmetricKey);
    const encryptedContent = arrayBufferToBase64(encryptedBuffer);
    const recipientPublicKeyB64 = await getGiftBoxPublicKey(giftBoxId);
    const recipientPublicKey = await importRecipientPublicKey(recipientPublicKeyB64);
    const encryptedKey = await encryptFixedSymmetricKey(recipientPublicKey);
    const res = await api.post(`/api/v1/gift-box/${giftBoxId}/gift/special/free`, {
      nickName,
      content: encryptedContent,
      encryptedKey,
      unBoxingTime,
    });
    return res.data;
  } catch (err) {
    console.error("sendSpecialFreeGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 하이브리드 암호화를 이용한 특별 질문 선물 보내기 API (FixedSymmetricKey 버전)
 *
 * 평문 편지 내용을 AES‑GCM (고정 IV 사용)으로 암호화한 후, 고정 대칭키를 RSA-OAEP 방식으로 암호화한 결과(encryptedKey)
 * 와 함께 질문과 개봉 시간(unBoxingTime)을 서버에 전송합니다.
 *
 * @param giftBoxId - 선물 박스 ID
 * @param nickName - 발신자 닉네임
 * @param question - 질문 내용 (평문)
 * @param plainContent - 평문 편지 내용 (암호화 대상)
 * @param unBoxingTime - 개봉 시간 (HH:mm 형식, 24시간제)
 */
export async function sendSpecialQuestionGift(
  giftBoxId: string,
  nickName: string,
  question: string,
  plainContent: string,
  unBoxingTime: string
) {
  try {
    const symmetricKey = await getFixedSymmetricKey();
    const encryptedBuffer = await encryptMessageAES(plainContent, symmetricKey);
    const encryptedContent = arrayBufferToBase64(encryptedBuffer);
    const recipientPublicKeyB64 = await getGiftBoxPublicKey(giftBoxId);
    const recipientPublicKey = await importRecipientPublicKey(recipientPublicKeyB64);
    const encryptedKey = await encryptFixedSymmetricKey(recipientPublicKey);
    const res = await api.post(`/api/v1/gift-box/${giftBoxId}/gift/special/question`, {
      nickName,
      question,
      answer: encryptedContent,
      encryptedKey,
      unBoxingTime,
    });
    return res.data;
  } catch (err) {
    console.error("sendSpecialQuestionGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 수신자가 받은 암호화된 편지를 복호화하는 함수
 *
 * 수신자는 자신의 RSA-OAEP 개인키(privateKey)를 이용하여 암호화된 대칭키(encryptedKey)를 복호화한 후,
 * 복원된 AES 대칭키와 고정 IV(FIXED_IV)를 사용하여 암호문(content)을 복호화합니다.
 *
 * @param encryptedContent - 암호화된 편지 내용 (Base64 문자열)
 * @param encryptedKey - 암호화된 대칭키 (Base64 문자열)
 * @param recipientPrivateKey - 수신자가 보유한 RSA-OAEP 개인키 (CryptoKey)
 * @returns 복호화된 평문 문자열
 */
export async function decryptLetter(
  encryptedContent: string,
  encryptedKey: string,
  recipientPrivateKey: CryptoKey
): Promise<string> {
  const { base64ToArrayBuffer } = await import("../utils/encryption");
  // 1. 암호화된 대칭키를 RSA-OAEP 방식으로 복호화하여 raw 대칭키를 복원
  const encryptedKeyBuffer = base64ToArrayBuffer(encryptedKey);
  const rawSymmetricKey = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    recipientPrivateKey,
    encryptedKeyBuffer
  );
  // 2. 복원된 raw 대칭키를 AES-GCM CryptoKey 객체로 가져옴
  const symmetricKey = await window.crypto.subtle.importKey(
    "raw",
    rawSymmetricKey,
    { name: "AES-GCM" },
    true,
    ["decrypt"]
  );
  // 3. 암호문(content)을 ArrayBuffer로 변환
  const cipherTextBuffer = base64ToArrayBuffer(encryptedContent);
  // 4. AES-GCM 복호화 (고정 IV 사용)
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: FIXED_IV },
    symmetricKey,
    cipherTextBuffer
  );
  return new TextDecoder().decode(decryptedBuffer);
}
