package chocolate.chocoletter.api.unboxingRoom.repository;

import chocolate.chocoletter.api.unboxingRoom.domain.UnboxingRoom;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UnboxingRoomRepository extends JpaRepository<UnboxingRoom, Long> {

    Optional<UnboxingRoom> findByGiftId(Long giftId);

    default UnboxingRoom findByGiftIdOrThrow(Long giftId) {
        return findByGiftId(giftId).orElseThrow(
                () -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_UNBOXING_ROOM)
        );
    }

    default UnboxingRoom findByIdOrThrow(Long unboxingRoomId) {
        return findById(unboxingRoomId).orElseThrow(
                () -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_UNBOXING_ROOM)
        );
    }

    @Query("select r from UnboxingRoom r where r.id = :roomId")
    UnboxingRoom findUnboxingRoomByRoomId(Long roomId);
}
