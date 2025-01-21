package chocolate.chocoletter.api.unboxingRoom.service;

import chocolate.chocoletter.api.unboxingRoom.domain.UnboxingRoom;
import chocolate.chocoletter.api.unboxingRoom.repository.UnboxingRoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UnboxingRoomService {
    private final UnboxingRoomRepository unboxingRoomRepository;

    @Transactional
    public void saveUnboxingRoom(UnboxingRoom unboxingRoom) {
        unboxingRoomRepository.save(unboxingRoom);
    }
}

