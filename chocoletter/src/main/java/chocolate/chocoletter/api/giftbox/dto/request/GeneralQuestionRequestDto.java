package chocolate.chocoletter.api.giftbox.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GeneralQuestionRequestDto(
        @NotNull
        @Size(min = 1, max = 25)
        String nickName,
        @NotNull
        String question,
        @NotNull
        @Size(min = 1, max = 200)
        String answer) {
}
