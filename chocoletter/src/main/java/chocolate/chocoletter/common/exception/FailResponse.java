package chocolate.chocoletter.common.exception;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FailResponse {
	private final int status;
	private final String message;

	public static FailResponse fail(int status, String message) {
		return FailResponse.builder()
			.status(status).
			message(message).
			build();
	}
}
