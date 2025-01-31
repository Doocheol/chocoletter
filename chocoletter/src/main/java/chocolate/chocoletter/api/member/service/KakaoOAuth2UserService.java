package chocolate.chocoletter.api.member.service;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftbox.repository.GiftBoxRepository;
import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.repository.MemberRepository;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final GiftBoxRepository giftBoxRepository;
    private final IdEncryptionUtil idEncryptionUtil;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        String socialId = oAuth2User.getAttribute("id").toString();

        // 닉네임은 중복가능성이 있기 때문에 socialId로 기존 회원 판단했습니다~
        Optional<Member> existingMember = memberRepository.findBySocialId(socialId);

        if (existingMember.isPresent()) { // 기존 회원인 경우
            Member member = existingMember.get();

            // 사용자 권한 설정 (특별한 권한 없을때 설정하는 기본 권한)
            Collection<GrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_USER"));

            GiftBox giftBox = giftBoxRepository.findByMemberId(member.getId());
            String shareCode = giftBox.getShareCode();

            // 사용자 속성 설정
            Map<String, Object> attributes = new HashMap<>();
            // 아래에서 주요 식별자로 "id"를 사용할 것이기 때문에 넣어줌
            attributes.put("id", member.getId());
            attributes.put("name", member.getName());
            attributes.put("profileImgUrl", member.getProfileImgUrl());
            attributes.put("isFirstLogin", "false");
            attributes.put("shareCode", shareCode);

            // OAuth2User 객체 생성 및 반환
            return new DefaultOAuth2User(authorities, attributes, "id");

        } else { // 신규 회원인 경우

            Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttributes().get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

            String name = (String) profile.get("nickname");
            String profileImgUrl = (String) profile.get("profile_image_url");

            Map<String, String> result = createNewMemberWithGiftBox(socialId, name, profileImgUrl);

            // 사용자 권한 설정 (특별한 권한 없을때 설정하는 기본 권한)
            Collection<GrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_USER"));

            // 사용자 속성 설정
            Map<String, Object> attributes = new HashMap<>();

            // 아래에서 주요 식별자로 "id"를 사용할 것이기 때문에 넣어줌
            attributes.put("id", result.get("memberId"));
            attributes.put("name", name);
            attributes.put("profileImgUrl", profileImgUrl);
            attributes.put("isFirstLogin", "true");
            attributes.put("shareCode", result.get("shareCode"));

            // OAuth2User 객체 생성 및 반환
            return new DefaultOAuth2User(authorities, attributes, "id");
        }
    }

    @Transactional
    public Map<String, String> createNewMemberWithGiftBox(String socialId, String name, String profileImgUrl) {

        // 멤버 생성 및 저장
        Member newMember = Member.builder()
                .socialId(socialId)
                .name(name)
                .profileImgUrl(profileImgUrl)
                .build();
        Member savedMember = memberRepository.save(newMember);

        // 기프트 박스 생성
        GiftBox newGiftBox = GiftBox.builder()
                .member(savedMember)
                .build();
        giftBoxRepository.save(newGiftBox);

        // 공유 코드 생성 및 저장
        String shareCode = encryptId(newGiftBox.getId());
        newGiftBox.updateShareCode(shareCode);

        Map<String, String> result = new HashMap<>();
        result.put("memberId", savedMember.getId().toString());
        result.put("shareCode", newGiftBox.getShareCode());

        return result;
    }

    private String encryptId(Long giftBoxId) {
        try {
            return idEncryptionUtil.encrypt(giftBoxId);
        } catch (Exception e) {
            log.warn("공유 코드 생성 실패"); // 이거 에러 처리 찝찝한디..
        }
        return null;
    }
}
