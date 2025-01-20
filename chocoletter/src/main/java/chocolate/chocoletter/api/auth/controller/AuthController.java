package chocolate.chocoletter.api.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/test")
public class AuthController implements AuthSwagger {
	private String dbusername;

	@GetMapping
	public ResponseEntity<?> test() {
		System.out.println(dbusername);
		return ResponseEntity.ok().body(new UserTest("son"));
	}
}
