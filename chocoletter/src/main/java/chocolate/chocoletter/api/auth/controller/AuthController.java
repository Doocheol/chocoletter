package chocolate.chocoletter.api.auth.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController("/test")
public class AuthController implements AuthSwagger{

    @GetMapping
    public ResponseEntity<?> test() {
        return ResponseEntity.ok().body(new UserTest("son"));
    }
}
