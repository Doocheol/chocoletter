package chocolate.chocoletter.api.letter.controller;

import chocolate.chocoletter.api.letter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.letter.service.LetterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/letter")
@RequiredArgsConstructor
public class LetterController implements LetterSwagger {
    private final LetterService letterService;

    @GetMapping("/question/{previousQuestionId}")
    public ResponseEntity<?> findRandomQuestion(@PathVariable("previousQuestionId") Long previousQuestionId) {
        RandomQuestionResponseDto randomQuestion = letterService.findRandomQuestion(previousQuestionId);
        return ResponseEntity.ok(randomQuestion);
    }
}
