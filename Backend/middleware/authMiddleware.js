import dotenv from "dotenv";
dotenv.config();
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

let domain = process.env.DOMAIN;
const audience = process.env.API_AUDIENCE;
const issuer = `https://${domain}/`;

// console.log("DOMAIN:", process.env.DOMAIN);
// console.log("API_AUDIENCE:", process.env.API_AUDIENCE);
// console.log("issuer:", issuer);

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),
  audience,
  issuer,
  algorithms: ["RS256"],
}
);
