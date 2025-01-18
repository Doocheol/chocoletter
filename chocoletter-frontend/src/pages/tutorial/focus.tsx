import React from "react";
import { useRouter } from "next/router";

const TutorialFocus = () => {
  const router = useRouter();

  const handleStart = () => {
    // 튜토리얼 완료 후 메인 페이지로 이동
    router.push("/main/my/before");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-8">Welcome to Chocoletter!</h1>
      <p className="text-lg mb-6 text-center max-w-md">
        Here, you'll learn how to use Chocoletter to send sweet messages to your loved ones.
      </p>
      <ul className="list-disc text-left mb-6 max-w-lg text-gray-600">
        <li>Write a heartfelt message to someone special.</li>
        <li>Choose beautiful themes for your letter.</li>
        <li>Send it and make someone's day brighter!</li>
      </ul>
      <button
        onClick={handleStart}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
      >
        Start Using Chocoletter
      </button>
    </div>
  );
};

export default TutorialFocus;
