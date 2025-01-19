package chocolate.chocoletter.api.gift.dto.response;

import chocolate.chocoletter.api.letter.domain.LetterType;
import lombok.Builder;

@Builder
public record LetterDto(LetterType type, String nickName, String content, String question, String answer) {
    
}
