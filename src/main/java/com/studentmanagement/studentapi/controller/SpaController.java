package com.studentmanagement.studentapi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {"/login", "/register", "/forgot-password",
            "/admin/{path:[^\\.]+}", "/admin/{path:[^\\.]+}/**",
            "/student/{path:[^\\.]+}", "/student/{path:[^\\.]+}/**"})
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
