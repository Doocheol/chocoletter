package chocolate.chocoletter.api.alarm.repository;

import chocolate.chocoletter.api.alarm.domain.Alarm;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    @Query("select a from Alarm a where a.memberId = :memberId order by a.createdAt desc")
    List<Alarm> findByAlarms(@Param("memberId") Long memberId);

    @Query("select count(*) from Alarm a where a.memberId = :memberId and a.isRead = :isRead")
    Integer countNewAlarm(@Param("memberId") Long memberId, @Param("isRead") Boolean isRead);
}
