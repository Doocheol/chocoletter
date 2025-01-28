package chocolate.chocoletter.api.member.service;

import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.repository.MemberRepository;
import chocolate.chocoletter.common.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class KakaoOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        Map<String, Object> kakaoAccount = oAuth2User.getAttribute("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        String name = (String) profile.get("nickname"); // 닉네임 사용

        // 기존 회원 확인
        Optional<Member> existingMember = memberRepository.findByName(name);

        if (existingMember.isPresent()) {
            Member member = existingMember.get();

            // 사용자 권한 설정
            Collection<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

            // 사용자 속성 설정
            Map<String, Object> attributes = new HashMap<>();
            attributes.put("id", member.getId());
            attributes.put("name", member.getName());
            attributes.put("social_id", member.getSocialId());

            // OAuth2User 객체 생성 및 반환
            return new DefaultOAuth2User(authorities, attributes, "id");
        } else {
            // 신규 회원인 경우 예외 발생
            throw new OAuth2AuthenticationException(new OAuth2Error("NEW_USER"), "신규 회원입니다.");
        }
    }
}
