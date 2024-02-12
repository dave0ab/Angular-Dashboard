package org.myproject.controllers;

import org.apache.commons.lang3.RandomStringUtils;
import org.myproject.exception.UserNotFoundException;
import org.myproject.models.ERole;
import org.myproject.models.Role;
import org.myproject.models.User;
import org.myproject.payload.request.LoginRequest;
import org.myproject.payload.request.SignupRequest;
import org.myproject.payload.response.JwtResponse;
import org.myproject.payload.response.MessageResponse;
import org.myproject.repository.RoleRepository;
import org.myproject.repository.UserRepository;
import org.myproject.security.jwt.JwtUtils;
import org.myproject.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
	private JavaMailSender emailSender;
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;


	@Transactional
	@GetMapping("/profile/{username}")
	Optional<Map<String, String>> getUserByUsername(@PathVariable String username) {

		Optional<User> pf = userRepository.findByUsername(username);

		return pf.map(user -> {

			List<GrantedAuthority> authorities = user.getRoles().stream()
					.map(role -> new SimpleGrantedAuthority(role.getName().name()))
					.collect(Collectors.toList());

			Map<String, String> nameMap = new HashMap<>();
			nameMap.put("firstName", user.getFirstname());
			nameMap.put("lastname", user.getLastname());
			nameMap.put("username", user.getUsername());
			nameMap.put("email", user.getEmail());
			nameMap.put("roles", String.valueOf(authorities).replace('[',' ').replace(']',' ') );

			return nameMap;
		});


	}



	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);

		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		List<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toList());


		return ResponseEntity.ok(new JwtResponse(jwt,userDetails.getUsername()));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Username is already taken!"));
		}

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Email is already in use!"));
		}

		// Create new user's account
		User user = new User(signUpRequest.getFirstname(),
				signUpRequest.getLastname(),
				signUpRequest.getUsername(),
							 signUpRequest.getEmail(),
							 encoder.encode(signUpRequest.getPassword()));

		Set<String> strRoles = signUpRequest.getRole();
		Set<Role> roles = new HashSet<>();

		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(userRole);
		} else {
			strRoles.forEach(role -> {
				switch (role) {
				case "admin":
					Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(adminRole);

					break;
				case "mod":
					Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(modRole);

					break;
				default:
					Role userRole = roleRepository.findByName(ERole.ROLE_USER)
							.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
					roles.add(userRole);
				}
			});
		}

		user.setRoles(roles);
		User savedUser=	userRepository.save(user);
		sendRegistrationEmail(savedUser);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}


	private void sendRegistrationEmail(User user) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(user.getEmail());
		message.setSubject("Registration Successful");
		message.setText("Hello " + user.getFirstname() + " " + user.getLastname() + ",\n\nThank you for registering!");

		emailSender.send(message);
	}



	@Transactional
	@PutMapping("/forget")
	public String forget(@RequestBody User newUser) {
		long b = 0;

		String randomWord = RandomStringUtils.randomAlphabetic(25);
		SecureRandom random = new SecureRandom();
		int randomNum = 100000 + random.nextInt(900000);
		User find = userRepository.findByEmail(newUser.getEmail());
		LocalDateTime currentDateTime = LocalDateTime.now();

		// Format the date and time (optional)
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String formattedDateTime = currentDateTime.format(formatter);

		return userRepository.findById(find.getId())
				.map(user -> {
					user.setCode(String.valueOf(randomNum));
					user.setCodeExpiry(formattedDateTime);
					forgetpasswordEmail(find, String.valueOf(randomNum));
					return "1";
				}).orElseThrow(() -> new UserNotFoundException(b));
	}



	private void forgetpasswordEmail(User user, String code) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(user.getEmail());
		message.setSubject("Registration Successful");
		message.setText("Hello " + user.getFirstname() + " " +user.getLastname()  +",\n\n" +
				"Here is your code " +  code);

		  emailSender.send(message);
	}



	@PostMapping("/check-code")
	public String CheckCode(@RequestBody User checkCode) {
		long b = 0;


		User find = userRepository.findByEmail(checkCode.getEmail());
		LocalDateTime currentDateTime = LocalDateTime.now();

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

		String databaseDateTimeString = find.getCodeExpiry(); // Replace with actual value from database
		LocalDateTime databaseDateTime = LocalDateTime.parse(databaseDateTimeString, formatter);
		long timeDiffInMinutes = Duration.between(databaseDateTime, currentDateTime).toMinutes();
		if (timeDiffInMinutes > 2) {

			return "Code Expired";

		} else {
			User user = userRepository.findByEmail(checkCode.getEmail());

			if (user != null && user.getCode().equals(checkCode.getCode())) {
				return "1";
			} else {
				return "Wrong Code";
			}
		}
	}


	@Transactional
	@PutMapping("/change-password")
	public String changePassword(@RequestBody User newUser) {

		long b = 0;


		User find = userRepository.findByEmail(newUser.getEmail());
		LocalDateTime currentDateTime = LocalDateTime.now();

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

		String databaseDateTimeString = find.getCodeExpiry(); // Replace with actual value from database
		LocalDateTime databaseDateTime = LocalDateTime.parse(databaseDateTimeString, formatter);
		long timeDiffInMinutes = Duration.between(databaseDateTime, currentDateTime).toMinutes();
		if (timeDiffInMinutes > 2) {

			return "Code Expired";

		}else{

			return userRepository.findById(find.getId())
					.map(user -> {
						user.setPassword(encoder.encode(newUser.getPassword()));
			            user.setCode("");
						user.setCodeExpiry("");

						return "1";
					}).orElseThrow(() -> new UserNotFoundException(b));
		}


	}












}
