package chocolate.chocoletter.api.gift.domain;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Gift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "gift_box_id")
    private GiftBox giftBox;
    private Long senderId;
    private Long receiverId;
    private Type type;
    private LocalDateTime unBoxingTime;
    private Integer rejectCount;
    private boolean isAccept;
    private boolean isOpened;
}
