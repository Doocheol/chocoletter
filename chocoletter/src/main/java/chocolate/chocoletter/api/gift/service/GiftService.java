package chocolate.chocoletter.api.gift.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import chocolate.chocoletter.api.gift.domain.GiftType;
import chocolate.chocoletter.api.gift.dto.response.GiftUnboxingInvitationResponseDto;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.ForbiddenException;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.service.LetterService;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.ForbiddenException;
import chocolate.chocoletter.common.exception.UnAuthorizedException;
import org.springframework.stereotype.Service;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.domain.GiftType;
import chocolate.chocoletter.api.gift.dto.response.GiftResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftUnboxingInvitationResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.ForbiddenException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GiftService {
	private final GiftRepository giftRepository;
	private final LetterService letterService;

    public GiftsResponseDto findAllGift(Long memberId) {
        List<Gift> gifts = giftRepository.findAllGift(memberId);
        return GiftsResponseDto.of(gifts.stream()
                .map(GiftResponseDto::of)
                .collect(Collectors.toList()));
    }

    public GiftsResponseDto findSpecialGift(Long memberId) {
        List<Gift> gifts = giftRepository.findSpecificGift(memberId, GiftType.SPECIAL);
        return GiftsResponseDto.of(gifts.stream()
                .map(GiftResponseDto::of)
                .collect(Collectors.toList()));
    }
	public GiftsResponseDto findSpecialGift(Long memberId) {
		List<Gift> gifts = giftRepository.findSpecificGift(memberId, GiftType.SPECIAL);
		return GiftsResponseDto.of(gifts.stream()
				.map(GiftResponseDto::of)
				.collect(Collectors.toList()));
	}

	public GiftDetailResponseDto findGiftDetail(Long memberId, Long giftId) {
		Gift gift = giftRepository.findGiftById(giftId);
		if(!memberId.equals(gift.getReceiverId())) throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
		LetterDto letter = letterService.findLetter(giftId);
		return GiftDetailResponseDto.of(gift, letter);
	}

	public GiftsResponseDto findGeneralGift(Long memberId) {
		List<Gift> gifts = giftRepository.findSpecificGift(memberId, GiftType.GENERAL);
		return GiftsResponseDto.of(gifts.stream()
				.map(GiftResponseDto::of)
				.collect(Collectors.toList()));
	}

    public GiftsResponseDto findGeneralGift(Long memberId) {
        List<Gift> gifts = giftRepository.findSpecificGift(memberId, GiftType.GENERAL);
        return GiftsResponseDto.of(gifts.stream()
                .map(GiftResponseDto::of)
                .collect(Collectors.toList()));
    }

    public GiftUnboxingInvitationResponseDto findUnboxingInvitation(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (gift.getReceiverId().equals(memberId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        String formattedUnboxingTime = formatUnboxingTime(gift.getUnBoxingTime());
        return GiftUnboxingInvitationResponseDto.of(formattedUnboxingTime);
    }

    private String formatUnboxingTime(LocalDateTime unboxingTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        return unboxingTime.format(formatter);
    }
}
