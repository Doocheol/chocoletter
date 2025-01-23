package chocolate.chocoletter.api.auth.service;

import chocolate.chocoletter.api.auth.domain.entity.User;
import chocolate.chocoletter.api.auth.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuth2AuthService extends DefaultOAuth2UserService {

    private final AuthRepository authRepository;


}
