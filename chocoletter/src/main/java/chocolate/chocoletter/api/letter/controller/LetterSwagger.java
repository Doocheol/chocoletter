package chocolate.chocoletter.api.letter.controller;

import org.springframework.http.ResponseEntity;

import chocolate.chocoletter.api.letter.dto.response.RandomQuestionResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

public interface LetterSwagger {
	@Operation(
		summary = "랜덤 질문 조회",
		description = "랜덤 편지를 골랐을 때나 질문이 마음에 들지 않을 때, 질문을 조회합니다.")
	@ApiResponses(
		value = {@ApiResponse(
			responseCode = "200",
			description = "성공적으로 조회",
			content = @Content(
				mediaType = "application/json",
				schema = @Schema(implementation = RandomQuestionResponseDto.class))),
			@ApiResponse(
				responseCode = "401",
				description = "인증 실패")
		})
	ResponseEntity<?> findRandomQuestion(Long questionId);
}
