package chocolate.chocoletter.api.gift.dto.response;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.domain.LetterType;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import lombok.Builder;

@Builder
public record GiftDetailResponseDto (Long giftId, LetterType type, String nickName, String content, String question, String answer){
    public static GiftDetailResponseDto of(Gift gift, LetterDto letter) {
        return GiftDetailResponseDto.builder()
                .giftId(gift.getId())
                .type(letter.type())
                .nickName(letter.nickName())
                .content(letter.content())
                .question(letter.question())
                .answer(letter.answer())
                .build();
    }
}
