package chocolate.chocoletter.api.unboxingRoom.service;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.service.LetterService;
import chocolate.chocoletter.api.unboxingRoom.domain.UnboxingRoom;
import chocolate.chocoletter.api.unboxingRoom.repository.UnboxingRoomRepository;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.ForbiddenException;
import chocolate.chocoletter.common.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UnboxingRoomService {
    private final UnboxingRoomRepository unboxingRoomRepository;
    private final LetterService letterService;

    @Transactional
    public void saveUnboxingRoom(UnboxingRoom unboxingRoom) {
        unboxingRoomRepository.save(unboxingRoom);
    }

    public GiftDetailResponseDto hasAccessToUnboxingRoom(Long memberId, Long unboxingRoomId) {
        UnboxingRoom unboxingRoom = unboxingRoomRepository.findByIdOrThrow(unboxingRoomId);
        if (unboxingRoom.getIsEnd()) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN_UNBOXING_ROOM_ALREADY_END);
        }
        if (isMemberAuthorized(memberId, unboxingRoom)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        Gift gift = unboxingRoom.getGift();
        LetterDto letter = letterService.findLetter(gift.getId());
        return GiftDetailResponseDto.of(gift, letter);
    }

    @Transactional
    public void endUnBoxingRoom(Long memberId, Long roomId) {
        UnboxingRoom unboxingRoom = unboxingRoomRepository.findUnboxingRoomByRoomId(roomId);
        if (unboxingRoom == null) {
            throw new NotFoundException(ErrorMessage.ERR_NOT_FOUND_UNBOXING_ROOM);
        }
        if (isMemberAuthorized(memberId, unboxingRoom)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        unboxingRoom.endRoom();
    }

    private boolean isMemberAuthorized(Long memberId, UnboxingRoom unboxingRoom) {
        return !unboxingRoom.getReceiverId().equals(memberId) && !unboxingRoom.getSenderId().equals(memberId);
    }
}

