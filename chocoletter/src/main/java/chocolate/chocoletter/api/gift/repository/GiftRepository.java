package chocolate.chocoletter.api.gift.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import chocolate.chocoletter.api.gift.domain.Gift;

@Repository
public interface GiftRepository extends JpaRepository<Gift, Long> {

	@Query("select g from Gift g where g.receiverId = :receiverId")
	List<Gift> findAll(@Param("receiverId") Long receiverId);
}
