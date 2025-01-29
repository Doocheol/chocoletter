package chocolate.chocoletter.api.gift.controller;

import chocolate.chocoletter.api.gift.dto.request.UnboxingInvitationRequestDto;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftUnboxingInvitationResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.service.GiftService;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("/{giftId}/receive")
    public ResponseEntity<?> findReceiveGiftDetail(@PathVariable("giftId") Long giftId) {
        Long memberId = 1L;
        GiftDetailResponseDto gift = giftService.findReceiveGiftDetail(memberId, giftId);
        return ResponseEntity.ok(gift);
    }

    @GetMapping("/{giftId}/send")
    public ResponseEntity<?> findSendGiftDetail(@PathVariable("giftId") Long giftId) {
        Long memberId = 2L;
        GiftDetailResponseDto gift = giftService.findSendGiftDetail(memberId, giftId);
        return ResponseEntity.ok(gift);
    }

    @GetMapping("/{giftId}/unboxing/invitation")
    public ResponseEntity<?> findUnboxingInvitation(@PathVariable Long giftId) {
        // 로그인 한 member를 가져오기
        Long memberId = 1L;
        GiftUnboxingInvitationResponseDto unboxingInvitation = giftService.findUnboxingInvitation(memberId, giftId);
        return ResponseEntity.ok(unboxingInvitation);
    }

    @PostMapping("/{giftId}/unboxing/invitation")
    public ResponseEntity<?> sendUnboxingInvitation(@PathVariable Long giftId,
                                                    @RequestBody @Valid UnboxingInvitationRequestDto requestDto) {
        // 로그인 한 유저가 sender
        Long senderId = 2L;
        giftService.sendUnboxingInvitation(senderId, giftId, requestDto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("{giftId}/unboxing/invitation/accept")
    public ResponseEntity<?> acceptUnboxingInvitation(@PathVariable Long giftId) {
        Long memberId = 1L;
        giftService.acceptUnboxingInvitation(memberId, giftId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("{giftId}/unboxing/invitation/reject")
    public ResponseEntity<?> rejectUnboxingInvitation(@PathVariable Long giftId) {
        Long memberId = 1L;
        giftService.rejectUnboxingInvitation(memberId, giftId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("{giftId}/type")
    public ResponseEntity<?> changeToGeneralGift(@PathVariable Long giftId) {
        // 초대를 보낸 유저로 로그인을 한다고 가정
        Long memberId = 2L;
        giftService.changeToGeneralGift(memberId, giftId);
        return ResponseEntity.ok().build();
    }
}
