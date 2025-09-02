import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const domain = "dev-u8s4p8uj6dw7435p.us.auth0.com";
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