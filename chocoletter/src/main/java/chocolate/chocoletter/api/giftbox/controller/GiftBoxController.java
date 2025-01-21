package chocolate.chocoletter.api.giftbox.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import chocolate.chocoletter.api.gift.service.GiftService;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftRequestDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/gift-box")
@RequiredArgsConstructor
public class GiftBoxController {
	private final GiftService giftService;

	@PostMapping("/{giftBoxId}/gift/general/general")
	public ResponseEntity<?> sendGeneralFreeGift(@PathVariable("giftBoxId") Long giftBoxId, @RequestBody
	GeneralFreeGiftRequestDto requestDto) {
		giftService.sendGeneralFreeGift(giftBoxId, requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
}
