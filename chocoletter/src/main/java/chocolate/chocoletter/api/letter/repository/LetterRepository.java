package chocolate.chocoletter.api.letter.repository;

import chocolate.chocoletter.api.letter.domain.Letter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LetterRepository extends JpaRepository<Letter, Long> {

    @Query("select l from Letter l where l.gift.id = :giftId")
    Letter findLetterByGiftId(@Param("giftId") Long giftId);
}
