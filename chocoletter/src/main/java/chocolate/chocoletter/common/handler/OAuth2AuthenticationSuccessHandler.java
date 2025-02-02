package chocolate.chocoletter.common.handler;

import chocolate.chocoletter.common.util.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenUtil jwtTokenUtil;

    @Value("${frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 사용자 정보
        String id = oAuth2User.getName();
        String name = (String) oAuth2User.getAttributes().get("name");
        String profileImgUrl;
        if (oAuth2User.getAttributes().get("profileImgUrl") == null) { // null일때 대비
            profileImgUrl = "null";
        } else {
            profileImgUrl = (String) oAuth2User.getAttributes().get("profileImgUrl");
        }
        String isFirstLogin = (String) oAuth2User.getAttributes().get("isFirstLogin");
        String giftBoxId = (String) oAuth2User.getAttributes().get("giftBoxId");

        String accessToken = jwtTokenUtil.createAccessToken(id);
        System.out.println(accessToken);

        // 리다이렉트 URL 생성
        String redirectUrl = frontendUrl + "/auth/kakao/callback"
                + "?accessToken=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
                + "&userName=" + URLEncoder.encode(name, StandardCharsets.UTF_8)
                + "&userProfileUrl=" + URLEncoder.encode(profileImgUrl, StandardCharsets.UTF_8)
                + "&isFirstLogin=" + URLEncoder.encode(isFirstLogin, StandardCharsets.UTF_8)
                + "&giftBoxId=" + URLEncoder.encode(giftBoxId, StandardCharsets.UTF_8);

        // 리다이렉트 수행
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}