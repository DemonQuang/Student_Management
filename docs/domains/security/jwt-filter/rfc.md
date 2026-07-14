# RFC: JWT Filter Design

## 1. Technical Objective
Specify token parsing, validation, and security context injection components to implement stateless JWT verification.

---

## 2. Component Design & Methods

### `JwtAuthenticationFilter` Class Structure
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserDetailsServiceImpl userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String jwt = getJwtFromRequest(request);

        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            String username = tokenProvider.getUsernameFromJWT(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

---

## 3. Key JWT Management Logic (`JwtTokenProvider`)

1. **Token Validation**:
   - Parse JWT signature using the configured secret key.
   - Catch errors: `SignatureException`, `MalformedJwtException`, `ExpiredJwtException`, `UnsupportedJwtException`, `IllegalArgumentException`. If caught, write a logging warning and return `false`.
2. **Subject Extraction**:
   - Extract subject string (e.g. username) via `Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject()`.
