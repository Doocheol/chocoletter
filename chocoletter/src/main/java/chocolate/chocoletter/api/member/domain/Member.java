package chocolate.chocoletter.api.member.domain;

import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	private String socialId;

	private String alarmAddress;
	private Integer sendGiftCount;

	@Builder
	public Member(String name, String socialId, String alarmAddress) {
		this.name = name;
		this.socialId = socialId;
		this.alarmAddress = alarmAddress;
		this.sendGiftCount = 0;
	}
}
