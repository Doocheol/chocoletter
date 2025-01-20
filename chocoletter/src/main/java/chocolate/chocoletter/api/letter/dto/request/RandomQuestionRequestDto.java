package chocolate.chocoletter.api.letter.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RandomQuestionRequestDto(
	@NotNull
	@Min(0)
	@Max(20)
	Long previousQuestionId) {
}
