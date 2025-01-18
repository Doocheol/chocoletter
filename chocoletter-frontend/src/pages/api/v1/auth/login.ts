import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return res.status(500).json({
      status: 500,
      errorMessage: "ERR_INTERNAL_SERVER_ERROR",
    });
  }

  try {
    // Spring Boot로 GET 요청 전달
    const response = await axios.get(`${baseUrl}/api/v1/users/auth/login`);

    // 성공 응답 전달 (200)
    res.status(200).json(response.data);
  } catch (error: any) {
    // console.error("에러 메세지 콘솔 찍어보기", error.message);

    // 실패 응답 전달 (500)
    if (error.response) {
      res.status(500).json(error.response.data);
    } else {
      res.status(500).json({
        status: 500,
        errorMessage: "ERR_INTERNAL_SERVER_ERROR",
      });
    }
  }
}
