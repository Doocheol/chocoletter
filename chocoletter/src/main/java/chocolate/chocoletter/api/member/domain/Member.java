package chocolate.chocoletter.api.member.domain;

import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseTimeEntity implements OAuth2User, UserDetails {

	@Id
	@Column(unique = true, nullable = false, updatable = false)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(name = "social_id", nullable = false)
	private String socialId;

	@Column(name = "profile_img_url")
	private String profileImgUrl;

	@Column(name = "send_gift_count")
	private Integer sendGiftCount;

	@Builder
	public Member(Long id, String name, String socialId, String profileImgUrl, Integer sendGiftCount) {
		this.id = id;
		this.name = name;
		this.socialId = socialId;
		this.profileImgUrl = profileImgUrl;
		this.sendGiftCount = sendGiftCount;
	}

	@Override
	public Map<String, Object> getAttributes() {
		Map<String, Object> attributes = new HashMap<>();
		attributes.put("name", name);
		attributes.put("profileImgUrl", profileImgUrl);
		return attributes;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
	}

	@Override
	public String getUsername() {return this.name; }

	@Override
	public String getPassword() { return null; } // OAuth2는 비밀번호 없음
}
