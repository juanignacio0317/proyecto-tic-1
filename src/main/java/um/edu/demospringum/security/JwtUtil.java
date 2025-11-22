package um.edu.demospringum.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import um.edu.demospringum.entities.UserData;
import um.edu.demospringum.repositories.UserDataRepository;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "mySecretKeyForJWT2025ThisIsAVeryLongSecretKeyThatShouldBeAtLeast256BitsLong";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 horas

    @Autowired
    private UserDataRepository userDataRepository;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // NUEVO: Método para extraer el rol del token
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // MODIFICADO: Ahora busca el usuario y obtiene su rol
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();

        // Buscar el usuario en la base de datos para obtener su rol
        UserData user = userDataRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Agregar el rol a los claims
        claims.put("role", user.getRole());

        return createToken(claims, username);
    }

    // NUEVO: Método alternativo si ya tienes el UserData
    public String generateTokenWithUser(UserData user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        return createToken(claims, user.getEmail());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

}