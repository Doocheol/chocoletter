package chocolate.chocoletter.api.giftbox.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;

@Repository
public interface GiftBoxRepository extends JpaRepository<GiftBox, Long> {
	@Query("select gb from GiftBox gb join fetch gb.member where gb.id= :giftBoxId")
	GiftBox findGiftBoxByGiftBoxId(@Param("giftBoxId") Long giftBoxId);
}
