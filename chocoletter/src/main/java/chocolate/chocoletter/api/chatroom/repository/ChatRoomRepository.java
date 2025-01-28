package chocolate.chocoletter.api.chatroom.repository;

import chocolate.chocoletter.api.chatroom.domain.ChatRoom;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends CrudRepository<ChatRoom, Long> {
}
