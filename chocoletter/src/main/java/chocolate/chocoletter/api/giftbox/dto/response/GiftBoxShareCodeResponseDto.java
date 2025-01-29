package chocolate.chocoletter.api.giftbox.dto.response;

public record GiftBoxShareCodeResponseDto(String shareCode) {
    public static GiftBoxShareCodeResponseDto of(String shareCode) {
        return new GiftBoxShareCodeResponseDto(shareCode);
    }
}
