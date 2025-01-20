package chocolate.chocoletter.api.letter.service;

import java.util.Random;

import org.springframework.stereotype.Service;

import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.domain.Question;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.letter.repository.LetterRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LetterService {
	private final LetterRepository letterRepository;

	public LetterDto findLetter(Long giftId) {
		Letter letter = letterRepository.findLetterByGiftId(giftId);
		return LetterDto.of(letter);
	}

	public RandomQuestionResponseDto findRandomQuestion(Long questionId) {
		Random random = new Random();
		Long randomId;
		if (questionId == 0) {
			randomId = random.nextLong(1, 21L);
		} else {
			do {
				randomId = random.nextLong(1, 21L);
			} while (randomId.equals(questionId));
		}
		Question question = letterRepository.findQuestions(randomId);
		return RandomQuestionResponseDto.of(question);
	}
}
