import api from "./api";
import { getGiftBoxPublicKey } from "./keyApi";
import { arrayBufferToBase64, base64ToArrayBuffer } from "../utils/encryption";

/**
 * 내부 유틸: 상대방의 공개키(Base64 문자열)를 CryptoKey 객체로 변환합니다.
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
 * RSA-OAEP를 이용해 평문 메시지를 직접 암호화합니다.
 *
 * @param plainText - 평문 메시지
 * @param publicKey - 수신자의 RSA-OAEP 공개키 (CryptoKey)
 * @returns 암호화된 메시지 (Base64 문자열)
 */
async function encryptContentWithPublicKey(
  plainText: string,
  publicKey: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const encryptedBuffer = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data);
  return arrayBufferToBase64(encryptedBuffer);
}

/**
 * 일반 자유 선물 보내기 API
 *
 * 수신자의 공개키를 조회한 후, 그 공개키로 평문 편지 내용을 직접 RSA-OAEP 방식으로 암호화하여
 * 암호문을 content 필드로 전송합니다.
 *
 * @param giftBoxId - 선물 박스 ID
 * @param nickName - 발신자 닉네임
 * @param plainContent - 평문 편지 내용
 */
export async function sendGeneralFreeGift(giftBoxId: string, nickName: string, content: string) {
  try {
    // 1. giftBoxId를 통해 상대방의 공개키(Base64 문자열) 조회
    const recipientPublicKeyB64 = await getGiftBoxPublicKey(giftBoxId);
    // 2. 공개키를 CryptoKey 객체로 변환
    const recipientPublicKey = await importRecipientPublicKey(recipientPublicKeyB64);
    // 3. 수신자의 공개키로 평문 편지 내용을 RSA-OAEP 방식으로 암호화
    const encryptedContent = await encryptContentWithPublicKey(content, recipientPublicKey);
    // 4. 암호화된 편지 내용을 content 필드로 전송
    const res = await api.post(`/api/v1/gift-box/${giftBoxId}/gift/general/free`, {
      nickName,
      content: encryptedContent,
    });
    return res.data;
  } catch (err) {
    console.error("sendGeneralFreeGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 일반 질문 선물 보내기 API
 *
 * 수신자의 공개키를 조회한 후, 그 공개키로 평문 편지 내용을 직접 RSA-OAEP 방식으로 암호화하여
 * 암호문을 content 필드로 전송합니다.
 *
 * @param giftBoxId - 선물 박스 ID
 * @param nickName - 발신자 닉네임
 * @param question - 질문 내용
 * @param plainContent - 평문 편지 내용
 */
export async function sendGeneralQuestionGift(
  giftBoxId: string,
  nickName: string,
  question: string,
  content: string
) {
  try {
    // 1. giftBoxId를 통해 상대방의 공개키(Base64 문자열) 조회
    const recipientPublicKeyB64 = await getGiftBoxPublicKey(giftBoxId);
    // 2. 공개키를 CryptoKey 객체로 변환
    const recipientPublicKey = await importRecipientPublicKey(recipientPublicKeyB64);
    // 3. 수신자의 공개키로 평문 편지 내용을 RSA-OAEP 방식으로 암호화
    const encryptedContent = await encryptContentWithPublicKey(content, recipientPublicKey);
    // 4. 암호화된 편지 내용을 content 필드로 전송
    const res = await api.post(`/api/v1/gift-box/${giftBoxId}/gift/general/question`, {
      nickName,
      question,
      answer: encryptedContent,
    });
    return res.data;
  } catch (err) {
    console.error("sendGeneralQuestionGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 특별 자유 선물 보내기 API
 *
 * 평문 편지 내용을 RSA-OAEP 방식으로 암호화하여 content 필드로 전송하고,
 * 추가로 개봉 시간(unBoxingTime)을 함께 전송합니다.
 *
 * @param giftBoxId - 선물 박스 ID
 * @param nickName - 발신자 닉네임
 * @param plainContent - 평문 편지 내용
 * @param unBoxingTime - 개봉 시간 (HH:mm 형식, 24시간제)
 */
export async function sendSpecialFreeGift(
  giftBoxId: string,
  nickName: string,
  content: string,
  unBoxingTime: string
) {
  try {
    // 1. 상대방의 공개키(Base64 문자열) 조회
    const recipientPublicKeyB64 = await getGiftBoxPublicKey(giftBoxId);
    // 2. 공개키를 CryptoKey 객체로 변환
    const recipientPublicKey = await importRecipientPublicKey(recipientPublicKeyB64);
    // 3. 평문 편지 내용을 RSA-OAEP 방식으로 암호화
    const encryptedContent = await encryptContentWithPublicKey(content, recipientPublicKey);
    // 4. 암호화된 편지 내용과 개봉 시간을 함께 전송
    const res = await api.post(`/api/v1/gift-box/${giftBoxId}/gift/special/free`, {
      nickName,
      content: encryptedContent,
      unBoxingTime,
    });
    return res.data;
  } catch (err) {
    console.error("sendSpecialFreeGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 특별 질문 선물 보내기 API
 *
 * 평문 편지 내용을 RSA-OAEP 방식으로 암호화하여 content 필드로 전송하고,
 * 추가로 개봉 시간(unBoxingTime)을 함께 전송합니다.
 *
 * @param giftBoxId - 선물 박스 ID
 * @param nickName - 발신자 닉네임
 * @param question - 질문 내용
 * @param plainContent - 평문 편지 내용
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
    // 1. 상대방의 공개키(Base64 문자열) 조회
    const recipientPublicKeyB64 = await getGiftBoxPublicKey(giftBoxId);
    // 2. 공개키를 CryptoKey 객체로 변환
    const recipientPublicKey = await importRecipientPublicKey(recipientPublicKeyB64);
    // 3. 평문 편지 내용을 RSA-OAEP 방식으로 암호화
    const encryptedContent = await encryptContentWithPublicKey(plainContent, recipientPublicKey);
    // 4. 암호화된 편지 내용과 개봉 시간을 함께 전송
    const res = await api.post(`/api/v1/gift-box/${giftBoxId}/gift/special/question`, {
      nickName,
      question,
      answer: encryptedContent,
      unBoxingTime,
    });
    return res.data;
  } catch (err) {
    console.error("sendSpecialFreeGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

/**
 * 수신자가 받은 암호화된 편지를 복호화하는 함수
 *
 * 수신자는 자신의 RSA-OAEP 개인키(privateKey)를 이용하여 암호문을 복호화합니다.
 *
 * @param encryptedContent - 암호화된 편지 내용 (Base64 문자열)
 * @param recipientPrivateKey - 수신자가 보유한 RSA-OAEP 개인키 (CryptoKey)
 * @returns 복호화된 평문 문자열
 */
export async function decryptLetter(
  encryptedContent: string,
  recipientPrivateKey: CryptoKey
): Promise<string> {
  const { base64ToArrayBuffer } = await import("../utils/encryption");
  const encryptedBuffer = base64ToArrayBuffer(encryptedContent);
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    recipientPrivateKey,
    encryptedBuffer
  );
  return new TextDecoder().decode(decryptedBuffer);
}
