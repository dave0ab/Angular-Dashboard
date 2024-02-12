package org.myproject.controllers;

import org.myproject.exception.UserNotFoundException;
import org.myproject.models.User;
import org.myproject.repository.UserRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Transactional
@SpringBootApplication
@RestController
@CrossOrigin("http://192.168.137.1:4200")
public class UserController {

    @Autowired
    private UserRepository userRepository;
   // @Autowired
    //private JavaMailSender emailSender;

    @Transactional
    @RequestMapping("/user")
    String newUser(@RequestBody User newUser) {
        if (userRepository.existsByEmail(newUser.getEmail())) {
            return "Email is already registered";
        }
        User savedUser = userRepository.save(newUser);
        sendRegistrationEmail(savedUser); // Send registration email after saving the user
        return "1";
    }

    @Transactional
    @GetMapping("/users")
    List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    @GetMapping("/user/{id}")
    User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional
    @PutMapping("/user/{id}")
    User updateUser(@RequestBody User newUser, @PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstname(newUser.getFirstname());
                    user.setLastname(newUser.getLastname());
                    user.setEmail(newUser.getEmail());
                    user.setPassword(newUser.getEmail());
                    return userRepository.save(user);
                }).orElseThrow(() -> new UserNotFoundException(id));
    }

    @PostMapping("/login")
    public String login(@RequestBody UserLoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            return "1";
        } else {
            return "Invalid credentials";
        }
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

    @Transactional
    @PutMapping("/user")
    User findUser(@RequestBody User newUser, @PathVariable Long id) {


        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstname(newUser.getFirstname());
                    user.setFirstname(newUser.getFirstname());
                    user.setEmail(newUser.getEmail());
                    user.setPassword(newUser.getPassword());

                    return userRepository.save(user);
                }).orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional
    @DeleteMapping("/user/{id}")
    String deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
        return "User with id " + id + " has been deleted success.";
    }

    private void sendRegistrationEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Registration Successful");
        message.setText("Hello " + user.getFirstname() + " " + user.getLastname() + ",\n\nThank you for registering!");

       // emailSender.send(message);
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
                    user.setPassword(newUser.getPassword());
                    user.setCode("");
                    user.setCodeExpiry("");

                    return "1";
                }).orElseThrow(() -> new UserNotFoundException(b));
    }


}




    private void forgetpasswordEmail(User user, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Registration Successful");
        message.setText("Hello " + user.getFirstname() + " " +user.getLastname()  +",\n\n" +
                "Here is your code " +  code);

    //    emailSender.send(message);
    }
}
