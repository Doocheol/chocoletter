package chocolate.chocoletter.api.gift.controller;

import chocolate.chocoletter.api.gift.dto.request.ModifyLetterRequestDto;
import chocolate.chocoletter.api.gift.dto.request.UnboxingInvitationRequestDto;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftUnboxingInvitationResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

public interface GiftSwagger {

    @Operation(
            summary = "전체 선물 목록 조회",
            description = "로그인한 회원의 전체 선물 목록을 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GiftsResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패")
            }
    )
    ResponseEntity<?> findAllGifts(Principal principal);

    @Operation(
            summary = "특별 선물 목록 조회",
            description = "로그인한 회원의 특별 선물 목록을 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GiftsResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패")
            }
    )
    ResponseEntity<?> findSpecialGifts(Principal principal);

    @Operation(
            summary = "일반 선물 목록 조회",
            description = "로그인한 회원의 일반 선물 목록을 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GiftsResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패")
            }
    )
    ResponseEntity<?> findGeneralGifts(Principal principal);

    @Operation(
            summary = "내가 받은 개별 선물 조회",
            description = "로그인한 회원이 자신이 받은 개별 선물 내용을 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GiftDetailResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패")
            }
    )
    ResponseEntity<?> findReceiveGiftDetail(
            @Parameter(
                    description = "암호화된 형태의 giftId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            ) Long giftId, Principal principal);

    @Operation(
            summary = "내가 보낸 개별 선물 조회",
            description = "로그인한 회원이 자신이 보낸 개별 선물 내용을 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GiftDetailResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패")
            }
    )
    ResponseEntity<?> findSendGiftDetail(Long giftId, Principal principal);

    @Operation(
            summary = "언박싱 초대장 조회",
            description = "언박싱 초대장을 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GiftUnboxingInvitationResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "403", description = "초대장은 받은 사람만 조회할 수 있습니다."),
                    @ApiResponse(responseCode = "404", description = "해당하는 초대장이 없습니다.")
            }
    )
    ResponseEntity<?> findUnboxingInvitation(
            @Parameter(
                    description = "암호화된 형태의 giftId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            ) Long giftId, Principal principal);

    @Operation(
            summary = "언박싱 초대장 전송",
            description = "언박싱 초대장을 전송합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 전송",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GiftUnboxingInvitationResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "400", description = "이미 수락된 선물에 대해서는 초대장을 보낼 수 없습니다."),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "403", description = "해당 선물을 보낸 유저만 초대장을 보낼 수 있습니다"),
                    @ApiResponse(responseCode = "404", description = "해당하는 초대장이 없습니다.")
            }
    )
    ResponseEntity<?> sendUnboxingInvitation(
            @Parameter(
                    description = "암호화된 형태의 giftId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @PathVariable("giftId") Long giftId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "언박싱 초대 시각을 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UnboxingInvitationRequestDto.class)
                    )
            ) @RequestBody
            UnboxingInvitationRequestDto requestDto,
            Principal principal
    );

    @Operation(
            summary = "언박싱 초대장 수락",
            description = "언박싱 초대장을 수락합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 수락",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "403", description = "초대장은 받은 사람만 수락할 수 있습니다."),
                    @ApiResponse(responseCode = "404", description = "해당하는 초대장이 없습니다.")
            }
    )
    ResponseEntity<?> acceptUnboxingInvitation(
            @Parameter(
                    description = "암호화된 형태의 giftId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            ) Long giftId, Principal principal);

    @Operation(
            summary = "언박싱 초대장 거절",
            description = "언박싱 초대장을 거절합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 거절",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "403", description = "초대장은 받은 사람만 거절할 수 있습니다."),
                    @ApiResponse(responseCode = "404", description = "해당하는 초대장이 없습니다.")
            }
    )
    ResponseEntity<?> rejectUnboxingInvitation(
            @Parameter(
                    description = "암호화된 형태의 giftId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            ) Long giftId, Principal principal);

    @Operation(
            summary = "특별 선물에서 일반 선물 변경",
            description = "언박싱 초대 거절 시, 보낸 사람은 일반 초콜릿으로 바꿀 수 있습니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 변경",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "403", description = "보낸 사람만 초대를 다시 할 수 있습니다."),
                    @ApiResponse(responseCode = "404", description = "해당하는 초대장이 없습니다.")
            }
    )
    ResponseEntity<?> changeToGeneralGift(
            @Parameter(
                    description = "암호화된 형태의 giftId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            ) Long giftId, Principal principal);

    @Operation(
            summary = "편지 수정",
            description = "상대방에게 이미 편지를 보냈고, 상대가 읽지 않았을 경우 수정합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "성공적으로 변경",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "404", description = "해당하는 초대장이 없습니다.")
            }
    )
    public ResponseEntity<?> modifyGift(
            @Parameter(
                    description = "암호화된 형태의 giftId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            ) Long giftId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "변경할 편지 내용",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ModifyLetterRequestDto.class)
                    )
            )
            @RequestBody ModifyLetterRequestDto requestDto, Principal principal);
}
