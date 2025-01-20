package chocolate.chocoletter.api.letter.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RandomQuestionRequestDto(
	@Schema(
		description = "이전 질문 ID (0 이상, 20 이하)",
		example = "5",
		minimum = "0",
		maximum = "20"
	)
	@NotNull
	@Min(0)
	@Max(20)
	Long previousQuestionId) {
}
