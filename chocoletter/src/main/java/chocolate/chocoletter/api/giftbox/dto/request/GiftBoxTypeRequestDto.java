package chocolate.chocoletter.api.giftbox.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GiftBoxTypeRequestDto(
        @NotNull
        @Size(min = 1, max = 5)
        Integer type) {
}