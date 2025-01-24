package chocolate.chocoletter.api.auth.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 사용자 이름을 통해 사용자 정보를 불러오는 로직
        // ex: 사용자 정보를 데이터베이스에서 조회
        return new org.springframework.security.core.userdetails.User(
                username,
                "",
                new  ArrayList<>()
        );
    }
}