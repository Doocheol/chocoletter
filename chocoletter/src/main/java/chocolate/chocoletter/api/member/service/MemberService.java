package chocolate.chocoletter.api.member.service;

import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.dto.request.LoginResponseDto;
import chocolate.chocoletter.api.member.repository.MemberRepository;
import chocolate.chocoletter.common.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResponseDto login(OAuth2User oAuth2User) {
        String name = oAuth2User.getAttribute("name");
        Member member = memberRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));

        String accessToken = jwtTokenProvider.createAccessToken(member);

        return new LoginResponseDto(accessToken);
    }

    @Transactional
    public void logout(String accessToken) {
        if (!jwtTokenProvider.validateToken(accessToken)) {
            throw new IllegalArgumentException("Invalid token");
        }
    }

    // 추가로 필요한 예외 클래스
    public class EntityNotFoundException extends RuntimeException {
        public EntityNotFoundException(String message) {
            super(message);
        }
    }
}
