package chocolate.chocoletter.api.gift.service;

import chocolate.chocoletter.api.chatroom.service.ChatRoomService;
import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.domain.GiftType;
import chocolate.chocoletter.api.gift.dto.request.UnboxingInvitationRequestDto;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftUnboxingInvitationResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.service.LetterService;
import chocolate.chocoletter.api.unboxingRoom.domain.UnboxingRoom;
import chocolate.chocoletter.api.unboxingRoom.service.UnboxingRoomService;
import chocolate.chocoletter.common.exception.BadRequestException;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.ForbiddenException;
import chocolate.chocoletter.common.util.DateTimeUtil;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
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
    private final ChatRoomService chatRoomService;
    private final DateTimeUtil dateTimeUtil;

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

    public GiftDetailResponseDto findReceiveGiftDetail(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftById(giftId);
        if (!memberId.equals(gift.getReceiverId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        LocalDate restrictedDate = LocalDate.of(2025, 2, 14);
        LocalDate today = LocalDate.now();
        if (today.isBefore(restrictedDate) && gift.getType() == GiftType.SPECIAL) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN_SPECIAL_BEFORE_DATE);
        }
        gift.openGift();
        LetterDto letter = letterService.findLetter(giftId);
        return GiftDetailResponseDto.of(gift, letter);
    }

    public GiftDetailResponseDto findSendGiftDetail(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftById(giftId);
        if (!memberId.equals(gift.getSenderId())) {
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
        String formattedUnboxingTime = dateTimeUtil.formatDateTime(gift.getUnBoxingTime());
        return GiftUnboxingInvitationResponseDto.of(formattedUnboxingTime);
    }

    @Transactional
    public void sendUnboxingInvitation(Long senderId, Long giftId, UnboxingInvitationRequestDto requestDto) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (!gift.getSenderId().equals(senderId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        if (gift.getType() == GiftType.GENERAL) {
            throw new BadRequestException(ErrorMessage.ERR_INVALID_GIFT_TYPE);
        }
        if (gift.getIsAccept()) {
            throw new BadRequestException(ErrorMessage.ERR_ALREADY_ACCEPT_UNBOXING_INVITATION);
        }
        gift.updateUnBoxingTime(dateTimeUtil.parseTimeToDateTime(requestDto.unBoxingTime()));
        // TODO : receiverId 에게 새로운 초대장 알림톡 발송
    }

    public List<String> findReceiverUnboxingTimes(Long memberId) {
        List<Gift> receiverSpecialGifts = giftRepository.findReceiverSpecialGifts(memberId, GiftType.SPECIAL);
        return receiverSpecialGifts.stream()
                .map(Gift::getUnBoxingTime)
                .distinct()
                .map(dateTimeUtil::formatDateTime)
                .collect(Collectors.toList());
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
                .gift(gift)
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
            Gift receiverGift = findGeneralGiftEachOther(gift.getReceiverId(), memberId);
            if (receiverGift != null) {
                chatRoomService.saveChatRoom(gift.getSenderId(), gift.getReceiverId(), giftId, receiverGift.getId());
            }
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
        Gift receiverGift = findGeneralGiftEachOther(gift.getReceiverId(), memberId);
        if (receiverGift != null) {
            chatRoomService.saveChatRoom(gift.getSenderId(), gift.getReceiverId(), giftId, receiverGift.getId());
        }
    }

    @Transactional
    public void saveGift(Gift gift) {
        giftRepository.save(gift);
    }

    public boolean findMyGift(Long senderId, Long giftBoxId) {
        return giftRepository.findGiftBySenderIdAndGiftBoxId(senderId, giftBoxId) != null;
    }

    public Gift findGeneralGiftEachOther(Long senderId, Long receiverId) {
        return giftRepository.findGeneralGiftBySenderIdAndReceiverId(senderId, receiverId, GiftType.GENERAL);
    }

}
