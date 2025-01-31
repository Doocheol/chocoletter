package chocolate.chocoletter.api.alarm.service;

import chocolate.chocoletter.api.alarm.domain.Alarm;
import chocolate.chocoletter.api.alarm.dto.response.AlarmResponseDto;
import chocolate.chocoletter.api.alarm.dto.response.AlarmsResponseDto;
import chocolate.chocoletter.api.alarm.dto.response.NewAlarmResponseDto;
import chocolate.chocoletter.api.alarm.repository.AlarmRepository;
import chocolate.chocoletter.api.gift.service.GiftService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlarmService {
    private final AlarmRepository alarmRepository;
    private final GiftService giftService;

    @Transactional
    public AlarmsResponseDto findMyAlarms(Long memberId) {
        List<Alarm> alarms = alarmRepository.findByAlarms(memberId);
        List<Long> giftIds = alarms.stream()
                .map(Alarm::getGiftId)
                .distinct()
                .toList();
        Map<Long, String> unboxingTimeMap = findUnBoxingTimes(giftIds);
        List<AlarmResponseDto> myAlarms = alarms.stream()
                .map(alarm -> AlarmResponseDto.of(alarm, unboxingTimeMap.get(alarm.getGiftId())))
                .toList();
        alarms.forEach(Alarm::readAlarm);
        return AlarmsResponseDto.of(myAlarms);
    }

    @Transactional
    public void save(Alarm alarm) {
        alarmRepository.save(alarm);
    }

    public NewAlarmResponseDto findNewAlarms(Long memberId) {
        return NewAlarmResponseDto.of(alarmRepository.countNewAlarm(memberId, false));
    }

    private Map<Long, String> findUnBoxingTimes(List<Long> giftIds) {
        List<Object[]> results = giftService.findUnBoxingTimes(giftIds);
        return results.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],  // giftId
                        row -> (String) row[1] // unboxingTime
                ));
    }
}
