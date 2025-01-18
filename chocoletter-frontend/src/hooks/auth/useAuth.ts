import { useEffect, useState } from "react";
import axios from "axios";

export function useAuth() {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean | null>(null); // 첫 로그인 여부
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true); // 로딩 상태

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const response = await axios.get("https://chocoletter.store/api/v1/auth/login");
        setIsFirstLogin(response.data.is_first_login);
      } catch (error) {
        console.error("Failed to fetch login status:", error);
        setIsFirstLogin(false); // 기본값으로 기존 사용자로 처리
      } finally {
        setIsAuthLoading(false); // 로딩 완료
      }
    };

    fetchLoginStatus();
  }, []);

  return { isFirstLogin, isAuthLoading };
}
