package chocolate.chocoletter.api.gift.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.dto.response.GiftResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GiftService {
	private final GiftRepository giftRepository;

	public GiftsResponseDto findAllGift(Long memberId) {
		List<Gift> gifts = giftRepository.findAllGift(memberId);
		return GiftsResponseDto.of(gifts.stream()
			.map(GiftResponseDto::of)
			.collect(Collectors.toList()));
	}
}
