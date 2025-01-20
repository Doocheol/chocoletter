package chocolate.chocoletter.api.gift.controller;

import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import org.springframework.http.ResponseEntity;

import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

public interface GiftSwagger {

	@Operation(summary = "전체 선물 목록 조회",
		description = "로그인한 회원의 전체 선물 목록을 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "성공적으로 조회",
			content = @Content(mediaType = "application/json",
				schema = @Schema(implementation = GiftsResponseDto.class))),
		@ApiResponse(responseCode = "401", description = "인증 실패")
	})
	ResponseEntity<?> findAllGifts();

	@Operation(summary = "특별 선물 목록 조회",
		description = "로그인한 회원의 특별 선물 목록을 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "성공적으로 조회",
			content = @Content(mediaType = "application/json",
				schema = @Schema(implementation = GiftsResponseDto.class))),
		@ApiResponse(responseCode = "401", description = "인증 실패")
	})
	ResponseEntity<?> findSpecialGifts();

	@Operation(summary = "개별 선물 조회",
		description = "로그인한 회원이 개별 선물 내용을 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "성공적으로 조회",
			content = @Content(mediaType = "application/json",
				schema = @Schema(implementation = GiftDetailResponseDto.class))),
		@ApiResponse(responseCode = "401", description = "인증 실패")
	})
	ResponseEntity<?> findGiftDetail(Long giftId);

	@Operation(summary = "일반 선물 목록 조회",
		description = "로그인한 회원의 일반 선물 목록을 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "성공적으로 조회",
			content = @Content(mediaType = "application/json",
				schema = @Schema(implementation = GiftsResponseDto.class))),
		@ApiResponse(responseCode = "401", description = "인증 실패")
	})
	ResponseEntity<?> findGeneralGifts();
}
