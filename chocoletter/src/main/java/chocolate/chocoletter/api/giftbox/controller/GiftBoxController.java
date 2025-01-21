package chocolate.chocoletter.api.giftbox.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.service.GiftBoxService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/gift-box")
@RequiredArgsConstructor
public class GiftBoxController implements GiftBoxSwagger {
	private final GiftBoxService giftBoxService;

	@PostMapping("/{giftBoxId}/gift/general/free")
	public ResponseEntity<?> sendGeneralFreeGift(@PathVariable("giftBoxId") Long giftBoxId, @RequestBody
	GeneralFreeGiftRequestDto requestDto) {
		// 로그인 한 유저 찾아오기
		Long memberId = 1L;
		giftBoxService.sendGeneralFreeGift(memberId, giftBoxId, requestDto);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
}
