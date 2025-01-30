package chocolate.chocoletter.api.giftbox.controller;

import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralQuestionRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialQuestionGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftCountResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.UnboxingTimesResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

public interface GiftBoxSwagger {

    @Operation(
            summary = "일반 자유 선물 전송",
            description = "특정 GiftBox에 일반 자유 선물을 전송합니다. 로그인한 사용자의 ID가 필요합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "선물이 성공적으로 전송되었습니다."),
            @ApiResponse(responseCode = "404", description = "없는 선물함 입니다.")
    })
    ResponseEntity<?> sendGeneralFreeGift(
            @Parameter(
                    description = "선물을 전송할 GiftBox의 ID",
                    required = true
            )
            @PathVariable("giftBoxId") Long giftBoxId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "일반 자유 선물의 상세 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GeneralFreeGiftRequestDto.class)
                    )
            )
            @RequestBody GeneralFreeGiftRequestDto requestDto
    );

    @Operation(
            summary = "일반 질문 선물 전송",
            description = "특정 GiftBox에 일반 질문 선물을 전송합니다. 로그인한 사용자의 ID가 필요합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "선물이 성공적으로 전송되었습니다."),
            @ApiResponse(responseCode = "404", description = "없는 선물함 입니다.")
    })
    ResponseEntity<?> sendGeneralQuestionGift(
            @Parameter(
                    description = "선물을 전송할 GiftBox의 ID",
                    required = true
            )
            @PathVariable("giftBoxId") Long giftBoxId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "일반 질문 선물의 상세 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GeneralQuestionRequestDto.class)
                    )
            )
            @RequestBody
            GeneralQuestionRequestDto requestDto);

    @Operation(
            summary = "특별 자유 선물 전송",
            description = "특정 GiftBox에 특별 자유 선물을 전송합니다. 로그인한 사용자의 ID가 필요합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "선물이 성공적으로 전송되었습니다."),
            @ApiResponse(responseCode = "404", description = "없는 선물함 입니다.")
    })
    ResponseEntity<?> sendSpecialFreeGift(
            @Parameter(
                    description = "선물을 전송할 GiftBox의 ID",
                    required = true
            )
            @PathVariable("giftBoxId") Long giftBoxId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "특별 자유 선물의 상세 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SpecialFreeGiftRequestDto.class)
                    )
            )
            @RequestBody
            SpecialFreeGiftRequestDto requestDto);

    @Operation(
            summary = "특별 질문 선물 전송",
            description = "특정 GiftBox에 특별 질문 선물을 전송합니다. 로그인한 사용자의 ID가 필요합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "선물이 성공적으로 전송되었습니다."),
            @ApiResponse(responseCode = "404", description = "없는 선물함 입니다.")
    })
    ResponseEntity<?> sendSpecialQuestionGift(
            @Parameter(
                    description = "선물을 전송할 GiftBox의 ID",
                    required = true
            )
            @PathVariable("giftBoxId") Long giftBoxId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "특별 질문 선물의 상세 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SpecialQuestionGiftRequestDto.class)
                    )
            ) @RequestBody
            SpecialQuestionGiftRequestDto requestDto);

    @Operation(
            summary = "내 선물 갯수 조회",
            description = "로그인한 사용자의 선물 개수를 조회합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GiftCountResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content)
    })
    ResponseEntity<?> findGiftCount();

    @Operation(
            summary = "내 선물 갯수 조회",
            description = "로그인한 사용자의 선물 개수를 조회합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GiftBoxResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "없는 초콜릿 박스 입니다.")
    })
    ResponseEntity<?> findGiftBox(
            @Parameter(
                    description = "정보를 볼 GiftBox의 ID",
                    required = true
            )
            @PathVariable("giftBoxId") Long giftBoxId);

    @Operation(
            summary = "상대방의 unboxing 스케줄 조회",
            description = "선물을 받을 사람의 RTC 스케줄을 조회합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UnboxingTimesResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "없는 초콜릿 박스 입니다.")
    })
    ResponseEntity<?> findUnboxingTimes(
            @Parameter(
                    description = "일정을 볼 GiftBox의 ID",
                    required = true
            )
            @PathVariable("giftBoxId") Long giftBoxId);

    @Operation(
            summary = "열어볼 수 있는 선물 카운트 사용",
            description = "열어볼 수 있는 선물 카운트를 사용합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UnboxingTimesResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    public ResponseEntity<?> usePreviewCount();
}
