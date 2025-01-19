package chocolate.chocoletter.api.gift.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.service.GiftService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/gift")
@RequiredArgsConstructor
public class GiftController implements GiftSwagger {
	private final GiftService giftService;

	@GetMapping("/all")
	public ResponseEntity<?> findAllGift() {
		// 로그인 한 member를 가져오기
		Long memberId = 1L;
		GiftsResponseDto gifts = giftService.findAllGift(memberId);
		return ResponseEntity.ok(gifts);
	}

	@GetMapping("/special")
	public ResponseEntity<?> findSpecialGift() {
		// 로그인 한 member를 가져오기
		Long memberId = 1L;
		GiftsResponseDto gifts = giftService.findSpecialGift(memberId);
		return ResponseEntity.ok(gifts);
	}

	@GetMapping("/{giftId}")
	public ResponseEntity<?> findGiftDetail(@PathVariable("giftId") Long giftId) {
		Long memberId = 1L;
		GiftDetailResponseDto gift = giftService.findGiftDetail(memberId, giftId);
		return ResponseEntity.ok(gift)
	}
}
