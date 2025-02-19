package chocolate.chocoletter.api.member.controller;

import chocolate.chocoletter.api.member.dto.request.PublicKeyRequestDto;
import chocolate.chocoletter.api.member.service.MemberService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
public class MemberController implements MemberSwagger {

    private final MemberService memberService;

    @GetMapping("/mypage")
    public ResponseEntity<?> findMyPage(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        return ResponseEntity.ok(memberService.findMypage(memberId));
    }

    @PostMapping("/key")
    public ResponseEntity<?> initPublicKey(@RequestBody PublicKeyRequestDto publicKeyRequestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        memberService.initPublicKey(memberId, publicKeyRequestDto.publicKey());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
