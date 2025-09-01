import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const domain = "YOUR_AUTH0_DOMAIN";
const audience = "https://ecommerce-api";

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),
  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ["RS256"],
});