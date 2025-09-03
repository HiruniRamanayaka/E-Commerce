import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const domain = process.env.DOMAIN;
const audience = process.env.API_AUDIENCE;

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