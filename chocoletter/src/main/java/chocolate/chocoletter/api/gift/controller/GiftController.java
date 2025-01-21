package chocolate.chocoletter.api.gift.controller;

import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftUnboxingInvitationResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.service.GiftService;
import chocolate.chocoletter.common.annotation.DecryptedId;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gift")
@RequiredArgsConstructor
public class GiftController implements GiftSwagger {
    private final GiftService giftService;
    private final IdEncryptionUtil idEncryptionUtil;

    @GetMapping("/all")
    public ResponseEntity<?> findAllGifts() {
        // 로그인 한 member를 가져오기
        Long memberId = 1L;
        GiftsResponseDto gifts = giftService.findAllGifts(memberId);
        return ResponseEntity.ok(gifts);
    }

    @GetMapping("/special")
    public ResponseEntity<?> findSpecialGifts() {
        // 로그인 한 member를 가져오기
        Long memberId = 1L;
        GiftsResponseDto gifts = giftService.findSpecialGifts(memberId);
        return ResponseEntity.ok(gifts);
    }

    @GetMapping("/general")
    public ResponseEntity<?> findGeneralGifts() {
        // 로그인 한 member를 가져오기
        Long memberId = 1L;
        GiftsResponseDto gifts = giftService.findGeneralGifts(memberId);
        return ResponseEntity.ok(gifts);
    }

    @GetMapping("/{giftId}")
    public ResponseEntity<?> findGiftDetail(@PathVariable("giftId") Long giftId) {
        Long memberId = 1L;
        GiftDetailResponseDto gift = giftService.findGiftDetail(memberId, giftId);
        return ResponseEntity.ok(gift);
    }

    @GetMapping("/{giftId}/unboxing/invitation")
    public ResponseEntity<?> findUnboxingInvitation(@PathVariable @DecryptedId Long giftId) {
        // 로그인 한 member를 가져오기
        Long memberId = 1L;
        GiftUnboxingInvitationResponseDto unboxingInvitation = giftService.findUnboxingInvitation(memberId, giftId);
        return ResponseEntity.ok(unboxingInvitation);
    }

    @PatchMapping("{giftId}/unboxing/invitation/accept")
    public ResponseEntity<?> acceptUnboxingInvitation(@PathVariable @DecryptedId Long giftId) {
        Long memberId = 1L;
        giftService.acceptUnboxingInvitation(memberId, giftId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("{giftId}/unboxing/invitation/reject")
    public ResponseEntity<?> rejectUnboxingInvitation(@PathVariable @DecryptedId Long giftId) {
        Long memberId = 1L;
        giftService.rejectUnboxingInvitation(memberId, giftId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/test")
    public void getEncryptedIdForTest() throws Exception {
        System.out.println(idEncryptionUtil.encrypt(1L));
    }
}
