package chocolate.chocoletter.api.unboxingRoom.repository;

import chocolate.chocoletter.api.unboxingRoom.domain.UnboxingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnboxingRoomRepository extends JpaRepository<UnboxingRoom, Long> {
}
