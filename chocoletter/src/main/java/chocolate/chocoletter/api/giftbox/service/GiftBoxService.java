package chocolate.chocoletter.api.giftbox.service;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.service.GiftService;
import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralQuestionRequestDto;
import chocolate.chocoletter.api.giftbox.repository.GiftBoxRepository;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.service.LetterService;
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
        GiftBox receiverGiftBox = giftBoxRepository.findGiftBoxByGiftBoxId(giftBoxId);
        if (receiverGiftBox == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND);
        }
        Gift gift = Gift.createGeneralGift(receiverGiftBox, senderId, receiverGiftBox.getMember().getId());
        giftService.saveGift(gift);
        Letter letter = Letter.createGeneralLetter(gift, requestDto.nickName(), requestDto.Content());
        letterService.saveLetter(letter);
    }

    public void sendGeneralQuestionGift(Long senderId, Long giftBoxId, GeneralQuestionRequestDto requestDto) {
        GiftBox receiverGiftBox = giftBoxRepository.findGiftBoxByGiftBoxId(giftBoxId);
        if (receiverGiftBox == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND);
        }
        Gift gift = Gift.createGeneralGift(receiverGiftBox, senderId, receiverGiftBox.getMember().getId());
        giftService.saveGift(gift);
        Letter letter = Letter.createQuestionLetter(gift, requestDto.nickName(), requestDto.question(),
                requestDto.answer());
        letterService.saveLetter(letter);
    }
}
