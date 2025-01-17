package chocolate.chocoletter.api.gift.service;

import org.springframework.stereotype.Service;

import chocolate.chocoletter.api.gift.repository.GiftRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GiftService {
	private final GiftRepository giftRepository;

	public void findAllGift(Long memberId) {
		giftRepository.findAllGift(memberId);
		return;
	}
}
