# Task Checklist: JWT Authentication Filter

This checklist tracks the development tasks required to implement the custom JWT Authentication Filter.

---

## 1. Filter Interceptor
- [ ] Create `JwtAuthenticationFilter` extending `OncePerRequestFilter`.
- [ ] Implement `getJwtFromRequest(request)` parsing Bearer authorization headers.
- [ ] Implement `doFilterInternal()`: parse token, call validation services, load user details, and inject UsernamePasswordAuthenticationToken context.

## 2. JWT Provider Utilities
- [ ] Implement `validateToken(String token)` verifying signature and expiration. Add SLF4J warn statements on exceptions.
- [ ] Implement `getUsernameFromJWT(String token)` extracting subject name claims.
