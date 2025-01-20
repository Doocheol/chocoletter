package chocolate.chocoletter.api.letter.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import chocolate.chocoletter.api.letter.dto.request.RandomQuestionRequestDto;
import chocolate.chocoletter.api.letter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.letter.service.LetterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/letter")
@RequiredArgsConstructor
public class LetterController implements LetterSwagger {
	private final LetterService letterService;

	@GetMapping("/question")
	public ResponseEntity<?> findRandomQuestion(@Valid @RequestBody RandomQuestionRequestDto requestDto) {
		RandomQuestionResponseDto randomQuestion = letterService.findRandomQuestion(requestDto.previousQuestionId());
		return ResponseEntity.ok(randomQuestion);
	}
}
