package chocolate.chocoletter.api.letter.service;

import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.repository.LetterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LetterService {
    private final LetterRepository letterRepository;
    public LetterDto findLetter(Long giftId) {
        Letter letter = letterRepository.findLetterByGiftId(giftId);
        return LetterDto.of(letter);
    }
}
