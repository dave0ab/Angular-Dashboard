package org.myproject.payload.request;

import javax.validation.constraints.NotBlank;

public class ProfileFind {

    @NotBlank
    private String username;

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @NotBlank
    private String firstname;
    private String lastname;
    private String email;




    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


}
