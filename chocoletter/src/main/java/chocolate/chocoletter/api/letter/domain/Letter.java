package chocolate.chocoletter.api.letter.domain;

import chocolate.chocoletter.api.gift.domain.Gift;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Letter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "gift_id")
    private Gift gift;
    private String nickname;
    private String content;
    private String question;
    private String answer;
}
