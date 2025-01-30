package chocolate.chocoletter.api.giftbox.controller;

import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralQuestionRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialQuestionGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftCountResponseDto;
import chocolate.chocoletter.api.giftbox.service.GiftBoxService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/gift-box")
@RequiredArgsConstructor
public class GiftBoxController implements GiftBoxSwagger {
    private final GiftBoxService giftBoxService;

    @PostMapping("/{giftBoxId}/gift/general/free")
    public ResponseEntity<?> sendGeneralFreeGift(@PathVariable("giftBoxId") Long giftBoxId, @Valid @RequestBody
    GeneralFreeGiftRequestDto requestDto, Principal principal) {
        // 로그인 한 유저 찾아오기
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendGeneralFreeGift(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{giftBoxId}/gift/general/question")
    public ResponseEntity<?> sendGeneralQuestionGift(@PathVariable("giftBoxId") Long giftBoxId, @Valid @RequestBody
    GeneralQuestionRequestDto requestDto, Principal principal) {
        // 로그인 한 유저 찾아오기
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendGeneralQuestionGift(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{giftBoxId}/gift/special/free")
    public ResponseEntity<?> sendSpecialFreeGift(@PathVariable("giftBoxId") Long giftBoxId, @Valid @RequestBody
    SpecialFreeGiftRequestDto requestDto, Principal principal) {
        // 로그인 한 유저 찾아오기
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendSpecialFreeGift(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{giftBoxId}/gift/special/question")
    public ResponseEntity<?> sendSpecialQuestionGift(@PathVariable("giftBoxId") Long giftBoxId, @Valid @RequestBody
    SpecialQuestionGiftRequestDto requestDto, Principal principal) {
        // 로그인 한 유저 찾아오기
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendSpecialQuestionGift(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/count")
    public ResponseEntity<?> findGiftCount(Principal principal) {
        // 로그인 한 유저 찾아오기
        Long memberId = Long.parseLong(principal.getName());
        GiftCountResponseDto responseDto = giftBoxService.findGiftCount(memberId);
        return ResponseEntity.ok(responseDto);
    }

    @PatchMapping("/preview")
    public ResponseEntity<?> usePreviewCount(Principal principal) {
        // 로그인 한 유저 찾아오기
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.usePreviewCount(memberId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{giftBoxId}")
    public ResponseEntity<?> findGiftBox(@PathVariable("giftBoxId") Long giftBoxId) {
        return ResponseEntity.ok(giftBoxService.findFriendGiftBox(giftBoxId));
    }

    @GetMapping("/{giftBoxId}/unboxing/schedule")
    public ResponseEntity<?> findUnboxingTimes(@PathVariable("giftBoxId") Long giftBoxId) {
        return ResponseEntity.ok(giftBoxService.findUnBoxingTimes(giftBoxId));
    }

    /**
     * Principle이 Authentication에 비해 정보를 더 적게 제공해줌
     * -> 필요한것만 제공해주는게 Principle이기 때문에 이거 사용
     */
    @GetMapping("/link")
    public ResponseEntity<?> getShareCode(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        return ResponseEntity.ok(giftBoxService.findShareCodeByMemberId(memberId));
    }

}