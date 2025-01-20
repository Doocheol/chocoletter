package chocolate.chocoletter.api.letter.controller;

import org.springframework.http.ResponseEntity;

import chocolate.chocoletter.api.letter.dto.request.RandomQuestionRequestDto;
import chocolate.chocoletter.api.letter.dto.response.RandomQuestionResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
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
	ResponseEntity<?> findRandomQuestion(@RequestBody(
		description = "랜덤 질문 요청 데이터 (첫 질문이면 previousQuestionId를 0으로, 새로고침이면 이전의 문제 id를 넣어주세요)",
		required = true,
		content = @Content(
			schema = @Schema(
				implementation = RandomQuestionRequestDto.class)))
	RandomQuestionRequestDto requestDto);
}
