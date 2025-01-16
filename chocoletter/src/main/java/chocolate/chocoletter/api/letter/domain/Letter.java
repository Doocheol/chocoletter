package chocolate.chocoletter.api.letter.domain;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Letter extends BaseTimeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "gift_id")
	private Gift gift;

	@Enumerated(EnumType.STRING)
	private LetterType type;

	private String nickname;

	private String content;

	private String question;

	private String answer;

	@Builder
	public Letter(Gift gift, String nickname, String content, String question, String answer) {
		this.gift = gift;
		this.nickname = nickname;
		this.content = content;
		this.question = question;
		this.answer = answer;
	}
}
