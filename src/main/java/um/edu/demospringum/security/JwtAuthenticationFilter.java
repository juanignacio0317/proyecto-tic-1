package um.edu.demospringum.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();


        System.out.println("\n========================================");
        System.out.println("🔍 JWT Filter - Request: " + request.getMethod() + " " + path);


        final String authorizationHeader = request.getHeader("Authorization");
        System.out.println("🔍 Authorization Header: " + (authorizationHeader != null ? "Present" : "Missing"));

        String username = null;
        String jwt = null;
        String role = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            System.out.println("🔍 JWT Token extraído (primeros 30 chars): " + jwt.substring(0, Math.min(30, jwt.length())) + "...");

            try {
                username = jwtUtil.extractUsername(jwt);
                role = jwtUtil.extractRole(jwt);

                System.out.println("✅ Username extraído: " + username);
                System.out.println("✅ Role extraído: " + role);
            } catch (Exception e) {
                System.err.println("❌ Error al extraer información del token: " + e.getMessage());
                logger.error("Error al extraer información del token", e);
            }
        } else {
            System.out.println("⚠️ No hay Authorization header o no empieza con 'Bearer '");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                System.out.println("✅ Token VÁLIDO");

                // ✅ Crear authority con el formato correcto
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                System.out.println("✅ Authority creada: " + authority.getAuthority());

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                Collections.singletonList(authority)
                        );

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                System.out.println("✅ Authentication SET en SecurityContext");
                System.out.println("✅ Authentication: " + SecurityContextHolder.getContext().getAuthentication());
            } else {
                System.out.println("❌ Token INVÁLIDO");
            }
        } else if (username != null) {
            System.out.println("⚠️ Ya existe authentication en SecurityContext");
        }

        System.out.println("🔍 Continuando con el filter chain...");
        System.out.println("========================================\n");

        chain.doFilter(request, response);
    }
}