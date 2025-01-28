package chocolate.chocoletter.api.member.controller;

import chocolate.chocoletter.api.member.dto.request.LoginResponseDto;
import chocolate.chocoletter.api.member.dto.response.LogoutRequestDto;
import chocolate.chocoletter.api.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class MemberController implements MemberSwagger {

    private final MemberService memberService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@AuthenticationPrincipal OAuth2User oAuth2User) {
        LoginResponseDto loginResponse = memberService.login(oAuth2User);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody LogoutRequestDto request) {
        memberService.logout(request.getAccessToken());
        return ResponseEntity.ok().build();
    }
}
