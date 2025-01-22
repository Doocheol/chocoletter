package chocolate.chocoletter.api.gift.repository;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.domain.GiftType;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GiftRepository extends JpaRepository<Gift, Long> {

    @Query("select g from Gift g where g.receiverId = :receiverId")
    List<Gift> findAllGift(@Param("receiverId") Long receiverId);

    @Query("select g from Gift g where g.receiverId = :receiverId and g.type = :giftType")
    List<Gift> findSpecificGift(@Param("receiverId") Long receiverId, @Param("giftType") GiftType giftType);

    @Query("select g from Gift g where g.id = :giftId")
    Gift findGiftById(@Param("giftId") Long giftId);

    @Query("select g from Gift g where g.type = :giftType and (g.receiverId = :memberId or g.senderId = :memberId)")
    List<Gift> findReceiverSpecialGifts(@Param("memberId") Long memberId, @Param("giftType") GiftType giftType);

    default Gift findGiftByIdOrThrow(Long giftId) {
        return findById(giftId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT));
    }
}
