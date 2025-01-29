package chocolate.chocoletter.api.giftbox.repository;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GiftBoxRepository extends JpaRepository<GiftBox, Long> {
    @Query("select gb from GiftBox gb join fetch gb.member where gb.id = :giftBoxId")
    GiftBox findGiftBoxByGiftBoxId(@Param("giftBoxId") Long giftBoxId);

    @Query("select gb from GiftBox gb where gb.member.id = :memberId")
    GiftBox findGiftBoxByMemberId(@Param("memberId") Long memberId);
    @Query("select gb.giftCount from GiftBox gb where gb.member.id = :memberId")
    Integer findGiftCountByGiftBoxId(@Param("memberId") Long memberId);

    default void updateShareCode(Long id, String shareCode) {
        findById(id).ifPresent(giftBox -> giftBox.updateShareCode(shareCode));
    }

    String findShareCodeByMemberId(Long memberId);
}
