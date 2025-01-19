import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Spring 서버로 요청 전달
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/kakao/login`
      );
      const { name, profile_url, is_first_login } = response.data;

      // 클라이언트에 성공 응답
      res.status(200).json({ name, profile_url, is_first_login });
    } catch (error) {
      // console.error("콘솔로 에러 찍어볼 수 있음", error);

      // 에러 메시지 통일
      res.status(500).json({ status: 500, errorMessage: "ERR_INTERNAL_SERVER_ERROR" });
    }
  } else {
    // 허용되지 않은 메서드
    res.status(500).json({ status: 500, errorMessage: "ERR_INTERNAL_SERVER_ERROR" });
  }
}
