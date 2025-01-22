import QRCode from 'qrcode';

export const copyQRCode = async (text: string) => {
    try {
        const dataURL = await QRCode.toDataURL(text);
        const response = await fetch(dataURL);
        const blob = await response.blob();
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
    } catch (error) {
        throw new Error("QR 코드 복사에 실패했습니다.");
    }
};