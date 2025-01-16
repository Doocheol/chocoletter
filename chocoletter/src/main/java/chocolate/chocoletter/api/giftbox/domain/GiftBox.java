package chocolate.chocoletter.api.giftbox.domain;

import chocolate.chocoletter.api.member.domain.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
public class GiftBox {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;
    private Integer giftCount;
    private String shareCode;


}
