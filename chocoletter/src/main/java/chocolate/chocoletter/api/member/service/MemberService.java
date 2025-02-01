package chocolate.chocoletter.api.member.service;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftbox.repository.GiftBoxRepository;
import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.dto.response.MyPageResponseDto;
import chocolate.chocoletter.api.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final GiftBoxRepository giftBoxRepository;

    public MyPageResponseDto findMypage(Long memberId) {
        Optional<GiftBox> giftBox = giftBoxRepository.findById(memberId);
        Optional<Member> member = memberRepository.findById(memberId);
        return MyPageResponseDto.of(giftBox.get(), member.get());
    }

}
