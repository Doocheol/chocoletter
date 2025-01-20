package chocolate.chocoletter.api.letter.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import chocolate.chocoletter.api.letter.service.LetterService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/letter")
@RequiredArgsConstructor
public class LetterController {
	private final LetterService letterService;

	@GetMapping("/question/{questionId}")
	public ResponseEntity<?> findRandomQuestion(@PathVariable("questionId") Long questionId) {
		letterService.findQuestion(questionId);
		return ResponseEntity.ok("");
	}
}
