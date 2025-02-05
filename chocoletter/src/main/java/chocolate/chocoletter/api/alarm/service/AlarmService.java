package chocolate.chocoletter.api.alarm.service;

import chocolate.chocoletter.api.alarm.domain.Alarm;
import chocolate.chocoletter.api.alarm.dto.response.AlarmResponseDto;
import chocolate.chocoletter.api.alarm.dto.response.AlarmsResponseDto;
import chocolate.chocoletter.api.alarm.dto.response.NewAlarmResponseDto;
import chocolate.chocoletter.api.alarm.repository.AlarmRepository;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlarmService {
    private final AlarmRepository alarmRepository;
    private final GiftRepository giftRepository;
    private final IdEncryptionUtil idEncryptionUtil;

    @Transactional
    public AlarmsResponseDto findMyAlarms(Long memberId) {
        // 1. null 방지 - repository 호출 후 null이면 빈 리스트 반환
        List<Alarm> alarms = Optional.ofNullable(alarmRepository.findByAlarms(memberId))
                .orElse(Collections.emptyList());

        // 2. null 방지 - null giftId가 있으면 제거 후 리스트 변환
        List<Long> giftIds = alarms.stream()
                .map(Alarm::getGiftId)
                .filter(Objects::nonNull) // null 값 제거
                .distinct()
                .toList();

        // 3. null 방지 - findUnBoxingTimes 메서드 내부에서 예외 방지 처리 추가
        Map<Long, String> unboxingTimeMap = findUnBoxingTimes(giftIds);

        // 4. null 방지 - Map에서 key가 없을 경우 안전 처리
        List<AlarmResponseDto> myAlarms = alarms.stream()
                .map(alarm -> AlarmResponseDto.of(
                        alarm,
                        unboxingTimeMap.getOrDefault(alarm.getGiftId(), null),
                        idEncryptionUtil.encrypt(alarm.getGiftId())
                ))
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
        // 1. giftIds가 null이거나 빈 리스트이면 바로 빈 Map 반환
        if (giftIds == null || giftIds.isEmpty()) {
            return Collections.emptyMap();
        }

        // 2. repository 조회 후 null 방지
        List<Object[]> results = Optional.ofNullable(giftRepository.findUnBoxingTimesByGiftIds(giftIds))
                .orElse(Collections.emptyList());

        // 3. Collectors.toMap() 실행 시 NullPointerException 방지
        return results.stream()
                .filter(row -> row != null && row.length >= 2 && row[0] != null) // null 값 필터링
                .collect(Collectors.toMap(
                        row -> (Long) row[0],  // giftId (null 방지)
                        row -> row[1] != null ? row[1].toString() : "" // null이면 빈 문자열 반환
                ));
    }
}
