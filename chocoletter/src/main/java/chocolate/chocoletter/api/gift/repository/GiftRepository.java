package chocolate.chocoletter.api.gift.repository;

import java.util.List;

import chocolate.chocoletter.api.gift.domain.GiftType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import chocolate.chocoletter.api.gift.domain.Gift;

@Repository
public interface GiftRepository extends JpaRepository<Gift, Long> {

	@Query("select g from Gift g where g.receiverId = :receiverId")
	List<Gift> findAllGift(@Param("receiverId") Long receiverId);

	@Query("select g from Gift g where g.receiverId = :receiverId and g.type = :giftType")
    List<Gift> findSpecificGift(@Param("receiverId") Long receiverId, @Param("giftType")GiftType giftType);

	@Query("select g from Gift g where g.id = :giftId")
	Gift findGiftById(@Param("giftId") Long giftId);
}
