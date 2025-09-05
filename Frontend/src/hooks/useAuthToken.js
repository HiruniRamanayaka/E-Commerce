import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export const useAuthToken = () => {
  const { getAccessTokenSilently, getIdTokenClaims, isAuthenticated } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const claims = await getIdTokenClaims();

        setAccessToken(token);
        setIdToken(claims.__raw);

        if (process.env.NODE_ENV === "development") {
          console.log("🔐 Access Token:", token);
          console.log("🧾 ID Token:", claims.__raw);
        }
      } catch (err) {
        console.error("Token fetch error:", err);
      }
    };

    fetchTokens();
  }, [isAuthenticated]);

  return { accessToken, idToken };
};