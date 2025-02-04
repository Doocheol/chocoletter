package chocolate.chocoletter.api.gift.service;

import chocolate.chocoletter.api.alarm.domain.Alarm;
import chocolate.chocoletter.api.alarm.domain.AlarmType;
import chocolate.chocoletter.api.alarm.service.AlarmService;
import chocolate.chocoletter.api.chatroom.service.ChatRoomService;
import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.domain.GiftType;
import chocolate.chocoletter.api.gift.dto.request.UnboxingInvitationRequestDto;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftUnboxingInvitationResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import chocolate.chocoletter.api.giftbox.dto.response.MyUnBoxingTimeResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.MyUnBoxingTimesResponseDto;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.service.LetterService;
import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.service.MemberService;
import chocolate.chocoletter.api.unboxingRoom.domain.UnboxingRoom;
import chocolate.chocoletter.api.unboxingRoom.service.UnboxingRoomService;
import chocolate.chocoletter.common.exception.BadRequestException;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.ForbiddenException;
import chocolate.chocoletter.common.util.DateTimeUtil;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class GiftService {
    private final GiftRepository giftRepository;
    private final LetterService letterService;
    private final UnboxingRoomService unboxingRoomService;
    private final ChatRoomService chatRoomService;
    private final AlarmService alarmService;
    private final DateTimeUtil dateTimeUtil;
    private final MemberService memberService;
    private final IdEncryptionUtil idEncryptionUtil;

    public GiftsResponseDto findAllGifts(Long memberId) {
        List<Gift> gifts = giftRepository.findAllGift(memberId);
        List<Long> giftIds = gifts.stream()
                .map(Gift::getId)
                .collect(Collectors.toList());
        Map<Long, Long> unBoxingRoomIdsByGiftIds = unboxingRoomService.findUnBoxingRoomIdsByGiftIds(giftIds);
        List<GiftResponseDto> giftResponseDtos = gifts.stream()
                .map(gift -> {
                    // gift의 id를 암호화
                    String encryptedGiftId = idEncryptionUtil.encrypt(gift.getId());
                    // unboxing id를 암호화
                    String encryptedUnboxingRoomId;
                    if (unBoxingRoomIdsByGiftIds.containsKey(gift.getId())) {
                        encryptedUnboxingRoomId = idEncryptionUtil.encrypt(unBoxingRoomIdsByGiftIds.get(gift.getId()));
                    } else {
                        encryptedUnboxingRoomId = null;
                    }
                    // Gift 객체를 GiftResponseDto로 변환
                    return GiftResponseDto.of(gift, encryptedGiftId, encryptedUnboxingRoomId);
                })
                .collect(Collectors.toList());

        return GiftsResponseDto.of(giftResponseDtos);
    }

    public GiftsResponseDto findSpecialGifts(Long memberId) {
        List<Gift> gifts = giftRepository.findSpecificGift(memberId, GiftType.SPECIAL);
        List<Long> giftIds = gifts.stream()
                .map(Gift::getId)
                .collect(Collectors.toList());
        Map<Long, Long> unBoxingRoomIdsByGiftIds = unboxingRoomService.findUnBoxingRoomIdsByGiftIds(giftIds);
        List<GiftResponseDto> giftResponseDtos = gifts.stream()
                .map(gift -> {
                    // gift의 id를 암호화
                    String encryptedGiftId = idEncryptionUtil.encrypt(gift.getId());
                    // unboxing id를 암호화
                    String encryptedUnboxingRoomId = idEncryptionUtil.encrypt(
                            unBoxingRoomIdsByGiftIds.get(gift.getId()));
                    // Gift 객체를 GiftResponseDto로 변환
                    return GiftResponseDto.of(gift, encryptedGiftId, encryptedUnboxingRoomId);
                })
                .collect(Collectors.toList());

        return GiftsResponseDto.of(giftResponseDtos);
    }

    @Transactional
    public GiftDetailResponseDto findReceiveGiftDetail(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftById(giftId);
        if (!memberId.equals(gift.getReceiverId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        LocalDate restrictedDate = dateTimeUtil.getOpenDay();
        LocalDate today = LocalDate.now();
        if (today.isBefore(restrictedDate) && gift.getType() == GiftType.SPECIAL) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN_SPECIAL_BEFORE_DATE);
        }
        gift.openGift();
        LetterDto letter = letterService.findLetter(giftId);
        return GiftDetailResponseDto.of(gift, letter);
    }

    public GiftDetailResponseDto findSendGiftDetail(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftById(giftId);
        if (!memberId.equals(gift.getSenderId())) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        LetterDto letter = letterService.findLetter(giftId);
        return GiftDetailResponseDto.of(gift, letter);
    }

    public GiftsResponseDto findGeneralGifts(Long memberId) {
        List<Gift> gifts = giftRepository.findSpecificGift(memberId, GiftType.GENERAL);
        List<GiftResponseDto> giftResponseDtos = gifts.stream()
                .map(gift -> {
                    // gift의 id를 암호화
                    String encryptedGiftId = idEncryptionUtil.encrypt(gift.getId());
                    // Gift 객체를 GiftResponseDto로 변환
                    return GiftResponseDto.of(gift, encryptedGiftId, null);
                })
                .collect(Collectors.toList());

        return GiftsResponseDto.of(giftResponseDtos);
    }

    public GiftUnboxingInvitationResponseDto findUnboxingInvitation(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (!gift.getReceiverId().equals(memberId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        String formattedUnboxingTime = dateTimeUtil.formatDateTime(gift.getUnBoxingTime());
        return GiftUnboxingInvitationResponseDto.of(formattedUnboxingTime);
    }

    @Transactional
    public void sendUnboxingInvitation(Long senderId, Long giftId, UnboxingInvitationRequestDto requestDto) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (!gift.getSenderId().equals(senderId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        if (gift.getType() == GiftType.GENERAL) {
            throw new BadRequestException(ErrorMessage.ERR_INVALID_GIFT_TYPE);
        }
        if (gift.getIsAccept()) {
            throw new BadRequestException(ErrorMessage.ERR_ALREADY_ACCEPT_UNBOXING_INVITATION);
        }
        gift.updateUnBoxingTime(dateTimeUtil.parseTimeToDateTime(requestDto.unBoxingTime()));
        LetterDto letter = letterService.findLetter(giftId);
        Alarm alarm = Alarm.builder()
                .type(AlarmType.RECEIVE_SPECIAL)
                .giftId(giftId)
                .member(memberService.findMember(gift.getReceiverId()))
                .partnerName(letter.nickName())
                .build();
        alarmService.save(alarm);
    }

    public List<String> findReceiverUnboxingTimes(Long memberId) {
        List<Gift> receiverSpecialGifts = giftRepository.findAllSpecialGifts(memberId, GiftType.SPECIAL);
        return receiverSpecialGifts.stream()
                .map(Gift::getUnBoxingTime)
                .distinct()
                .map(dateTimeUtil::formatDateTime)
                .collect(Collectors.toList());
    }

    @Transactional
    public void acceptUnboxingInvitation(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (!gift.getReceiverId().equals(memberId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        gift.acceptUnboxing();

        Member receiver = memberService.findMember(memberId);
        Alarm alarm = Alarm.builder()
                .type(AlarmType.ACCEPT_SPECIAL)
                .giftId(giftId)
                .member(memberService.findMember(gift.getReceiverId()))
                .partnerName(receiver.getName())
                .build();
        alarmService.save(alarm);

        UnboxingRoom unboxingRoom = UnboxingRoom.builder()
                .gift(gift)
                .receiverId(gift.getReceiverId())
                .senderId(gift.getSenderId())
                .startTime(gift.getUnBoxingTime())
                .build();

        unboxingRoomService.saveUnboxingRoom(unboxingRoom);
    }

    @Transactional
    public void rejectUnboxingInvitation(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (!gift.getReceiverId().equals(memberId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        gift.changeToGeneralGift();
        Member receiver = memberService.findMember(memberId);
        Alarm alarm = Alarm.builder()
                .type(AlarmType.REJECT_SPECIAL)
                .giftId(giftId)
                .member(memberService.findMember(gift.getReceiverId()))
                .partnerName(receiver.getName())
                .build();
        alarmService.save(alarm);
    }

    @Transactional
    public void changeToGeneralGift(Long memberId, Long giftId) {
        Gift gift = giftRepository.findGiftByIdOrThrow(giftId);
        if (!gift.getSenderId().equals(memberId)) {
            throw new ForbiddenException(ErrorMessage.ERR_FORBIDDEN);
        }
        gift.changeToGeneralGift();
        Gift receiverGift = findGeneralGiftEachOther(gift.getReceiverId(), memberId);
        if (receiverGift != null) {
            chatRoomService.saveChatRoom(gift.getSenderId(), gift.getReceiverId(), giftId, receiverGift.getId());
        }
    }

    @Transactional
    public void saveGift(Gift gift) {
        giftRepository.save(gift);
    }

    public boolean findMyGift(Long senderId, Long giftBoxId) {
        return giftRepository.findGiftBySenderIdAndGiftBoxId(senderId, giftBoxId) != null;
    }

    public Gift findGeneralGiftEachOther(Long senderId, Long receiverId) {
        return giftRepository.findGeneralGiftBySenderIdAndReceiverId(senderId, receiverId, GiftType.GENERAL);
    }

    public MyUnBoxingTimesResponseDto findMyUnBoxingTimes(Long memberId) {
        List<Gift> gifts = giftRepository.findAllSpecialGifts(memberId, GiftType.SPECIAL);
        List<Long> giftIds = gifts.stream()
                .map(Gift::getId)
                .collect(Collectors.toList());
        Map<Long, Long> unBoxingRoomIdsByGiftIds = unboxingRoomService.findUnBoxingRoomIdsByGiftIds(giftIds);
        List<MyUnBoxingTimeResponseDto> myUnBoxingTimes = gifts.stream()
                .map(gift -> {
                    String nickname = findUnBoxingName(memberId, gift);
                    String formattedTime = dateTimeUtil.formatDateTime(gift.getUnBoxingTime());
                    String encryptedUnboxingRoomId = idEncryptionUtil.encrypt(
                            unBoxingRoomIdsByGiftIds.get(gift.getId()));
                    return MyUnBoxingTimeResponseDto.of(formattedTime, nickname, encryptedUnboxingRoomId);
                })
                .collect(Collectors.toList());

        return MyUnBoxingTimesResponseDto.of(myUnBoxingTimes);
    }

    private String findUnBoxingName(Long memberId, Gift gift) {
        if (memberId.equals(gift.getReceiverId())) {
            return letterService.findNickNameByGiftId(gift.getId());
        }
        if (memberId.equals(gift.getSenderId())) {
            return memberService.findMember(gift.getReceiverId()).getName();
        }
        return "";
    }
}