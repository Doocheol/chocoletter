package chocolate.chocoletter.api.gift.dto.response;

import java.time.LocalDateTime;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.domain.GiftType;
import lombok.Builder;

@Builder
public record GiftResponseDto(String giftId, GiftType giftType, Boolean isOpened, LocalDateTime unBoxingTime) {
	public static GiftResponseDto of(Gift gift, String encryptedId) {
		return GiftResponseDto.builder()
			.giftId(encryptedId)
			.giftType(gift.getType())
			.isOpened(gift.getIsOpened())
			.unBoxingTime(gift.getUnBoxingTime())
			.build();
	}
}
