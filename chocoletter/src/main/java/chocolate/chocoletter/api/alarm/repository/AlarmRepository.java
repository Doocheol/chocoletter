package chocolate.chocoletter.api.alarm.repository;

import chocolate.chocoletter.api.alarm.domain.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    
}
