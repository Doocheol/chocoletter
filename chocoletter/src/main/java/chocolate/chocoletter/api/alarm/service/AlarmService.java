package chocolate.chocoletter.api.alarm.service;

import chocolate.chocoletter.api.alarm.dto.response.AlarmResponseDto;
import chocolate.chocoletter.api.alarm.dto.response.AlarmsResponseDto;
import chocolate.chocoletter.api.alarm.domain.Alarm;
import chocolate.chocoletter.api.alarm.repository.AlarmRepository;
import chocolate.chocoletter.api.gift.service.GiftService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlarmService {
    private final AlarmRepository alarmRepository;
    private final GiftService giftService;

    public AlarmsResponseDto findMyAlarms(Long memberId) {
        return AlarmsResponseDto.of(alarmRepository.findByAlarms(memberId).stream()
                .map(alarm -> AlarmResponseDto.of(alarm, giftService.findUnBoxingTime(alarm.getGiftId())))
                .toList());
    }

    @Transactional
    public void save(Alarm alarm) {
        alarmRepository.save(alarm);
    }
}
