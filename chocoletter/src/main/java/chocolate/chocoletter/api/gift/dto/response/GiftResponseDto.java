package chocolate.chocoletter.api.gift.dto.response;

import java.time.LocalDateTime;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.domain.GiftType;
import lombok.Builder;

@Builder
public record GiftResponseDto(Long giftId, GiftType giftType, Boolean isOpened, LocalDateTime unBoxingTime) {
	public static GiftResponseDto of(Gift gift) {
		return GiftResponseDto.builder()
			.giftId(gift.getId())
			.giftType(gift.getType())
			.isOpened(gift.getIsOpened())
			.unBoxingTime(gift.getUnBoxingTime())
			.build();
	}
}
