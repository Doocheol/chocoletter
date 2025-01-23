package chocolate.chocoletter.api.giftbox.service;

import static chocolate.chocoletter.common.util.DateTimeUtil.parseTimeToDateTime;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.service.GiftService;
import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralQuestionRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialQuestionGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.UnboxingTimesResponseDto;
import chocolate.chocoletter.api.giftbox.repository.GiftBoxRepository;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.service.LetterService;
import chocolate.chocoletter.common.exception.BadRequestException;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GiftBoxService {
    private final GiftBoxRepository giftBoxRepository;
    private final GiftService giftService;
    private final LetterService letterService;


    public void sendGeneralFreeGift(Long senderId, Long giftBoxId, GeneralFreeGiftRequestDto requestDto) {
        checkGiftExists(senderId);
        GiftBox receiverGiftBox = findGiftBox(giftBoxId);
        Gift gift = Gift.createGeneralGift(receiverGiftBox, senderId, receiverGiftBox.getMember().getId());
        giftService.saveGift(gift);
        receiverGiftBox.addGiftCount();
        Letter letter = Letter.createGeneralLetter(gift, requestDto.nickName(), requestDto.content());
        letterService.saveLetter(letter);
    }

    public void sendGeneralQuestionGift(Long senderId, Long giftBoxId, GeneralQuestionRequestDto requestDto) {
        checkGiftExists(senderId);
        GiftBox receiverGiftBox = findGiftBox(giftBoxId);
        Gift gift = Gift.createGeneralGift(receiverGiftBox, senderId, receiverGiftBox.getMember().getId());
        giftService.saveGift(gift);
        receiverGiftBox.addGiftCount();
        Letter letter = Letter.createQuestionLetter(gift, requestDto.nickName(), requestDto.question(),
                requestDto.answer());
        letterService.saveLetter(letter);
    }

    public void sendSpecialFreeGift(Long senderId, Long giftBoxId, SpecialFreeGiftRequestDto requestDto) {
        checkGiftExists(senderId);
        GiftBox receiverGiftBox = findGiftBox(giftBoxId);
        Gift gift = Gift.createSpecialGift(receiverGiftBox, senderId, receiverGiftBox.getMember().getId(),
                parseTimeToDateTime(requestDto.unBoxingTime()));
        giftService.saveGift(gift);
        receiverGiftBox.addGiftCount();
        Letter letter = Letter.createGeneralLetter(gift, requestDto.nickName(), requestDto.content());
        letterService.saveLetter(letter);
    }

    public void sendSpecialQuestionGift(Long senderId, Long giftBoxId, SpecialQuestionGiftRequestDto requestDto) {
        checkGiftExists(senderId);
        GiftBox receiverGiftBox = findGiftBox(giftBoxId);
        Gift gift = Gift.createSpecialGift(receiverGiftBox, senderId, receiverGiftBox.getMember().getId(),
                parseTimeToDateTime(requestDto.unBoxingTime()));
        giftService.saveGift(gift);
        receiverGiftBox.addGiftCount();
        Letter letter = Letter.createQuestionLetter(gift, requestDto.nickName(), requestDto.question(),
                requestDto.answer());
        letterService.saveLetter(letter);
    }

    public Integer findGiftCount(Long memberId) {
        return giftBoxRepository.findGiftCountByGiftBoxId(memberId);
    }

    public GiftBoxResponseDto findFriendGiftBox(Long giftBoxId) {
        GiftBox friendGiftBox = findGiftBox(giftBoxId);
        return GiftBoxResponseDto.of(friendGiftBox);
    }

    public UnboxingTimesResponseDto findUnBoxingTimes(Long giftBoxId) {
        return UnboxingTimesResponseDto.of(
                giftService.findReceiverUnboxingTimes(findGiftBox(giftBoxId).getMember().getId()));
    }

    private GiftBox findGiftBox(Long giftBoxId) {
        GiftBox receiverGiftBox = giftBoxRepository.findGiftBoxByGiftBoxId(giftBoxId);
        if (receiverGiftBox == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT_BOX);
        }
        return receiverGiftBox;
    }

    private void checkGiftExists(Long senderId) {
        if (!giftService.findMyGift(senderId)) {
            throw new BadRequestException(ErrorMessage.ERR_ALREADY_EXISTS_GIFT);
        }
    }
}
