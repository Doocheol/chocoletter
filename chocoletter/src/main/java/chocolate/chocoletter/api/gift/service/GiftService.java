package chocolate.chocoletter.api.gift.service;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.domain.GiftType;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftUnboxingInvitationResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.service.LetterService;
import chocolate.chocoletter.api.unboxingRoom.domain.UnboxingRoom;
import chocolate.chocoletter.api.unboxingRoom.service.UnboxingRoomService;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.ForbiddenException;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GiftService {
    private final GiftRepository giftRepository;
    private final LetterService letterService;
    private final UnboxingRoomService unboxingRoomService;

    public GiftsResponseDto findAllGifts(Long memberId) {
        List<Gift> gifts = giftRepository.findAllGift(memberId);
        return GiftsResponseDto.of(gifts.stream()
                .map(GiftResponseDto::of)
                .collect(Collectors.toList()));
    }

    public GiftsResponseDto findSpecialGifts(Long memberId) {
        List<Gift> gifts = giftRepository.findSpecificGift(memberId, GiftType.SPECIAL);
        return GiftsResponseDto.of(gifts.stream()
                .map(GiftResponseDto::of)
                .collect(Collectors.toList()));
    }

    public GiftDetailResponseDto findGiftDetail(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftById(giftId);
        if (!memberId.equals(gift.getReceiverId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        LetterDto letter = letterService.findLetter(giftId);
        return GiftDetailResponseDto.of(gift, letter);
    }

    public GiftsResponseDto findGeneralGifts(Long memberId) {
        List<Gift> gifts = giftRepository.findSpecificGift(memberId, GiftType.GENERAL);
        return GiftsResponseDto.of(gifts.stream()
                .map(GiftResponseDto::of)
                .collect(Collectors.toList()));
    }

    public GiftUnboxingInvitationResponseDto findUnboxingInvitation(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (!gift.getReceiverId().equals(memberId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        String formattedUnboxingTime = formatUnboxingTime(gift.getUnBoxingTime());
        return GiftUnboxingInvitationResponseDto.of(formattedUnboxingTime);
    }

    @Transactional
    public void acceptUnboxingInvitation(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (!gift.getReceiverId().equals(memberId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        gift.acceptUnboxing();
        // TODO : senderId에 맞는 유저한테 알림톡 전송

        UnboxingRoom unboxingRoom = UnboxingRoom.builder()
                .receiverId(gift.getReceiverId())
                .senderId(gift.getSenderId())
                .startTime(gift.getUnBoxingTime())
                .build();

        unboxingRoomService.saveUnboxingRoom(unboxingRoom);
    }

    @Transactional
    public void rejectUnboxingInvitation(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (!gift.getReceiverId().equals(memberId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        gift.rejectUnboxing();
        if (gift.getRejectCount() == 3) {
            gift.changeToGeneralGift();
            // TODO : senderId 에게 일반 초콜렛으로 바뀌었다는 알림 전송
            return;
        }
        // TODO : senderId 에게 언박싱 일정 거절 알림 전송
    }

    @Transactional
    public void changeToGeneralGift(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (!gift.getSenderId().equals(memberId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        gift.changeToGeneralGift();
    }

    private String formatUnboxingTime(LocalDateTime unboxingTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        return unboxingTime.format(formatter);
    }

    public void saveGift(Gift gift) {
        giftRepository.save(gift);
    }
}
