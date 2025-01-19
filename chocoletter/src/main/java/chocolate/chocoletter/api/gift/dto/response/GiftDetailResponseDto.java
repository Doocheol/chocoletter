package chocolate.chocoletter.api.gift.dto.response;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.domain.LetterType;
import lombok.Builder;

@Builder
public record GiftDetailResponseDto (Long giftId, LetterType type, String nickName, String content, String question, String answer){
    public static GiftDetailResponseDto of(Gift gift, Letter letter) {
        return GiftDetailResponseDto.builder()
                .giftId(gift.getId())
                .type(letter.getType())
                .nickName(letter.getNickname())
                .content(letter.getContent())
                .question(letter.getQuestion())
                .answer(letter.getAnswer())
                .build();
    }
}
