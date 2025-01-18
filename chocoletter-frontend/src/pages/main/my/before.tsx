import React from "react";
import { useRecoilValue } from "recoil";
import { userNameAtom, userProfileUrlAtom } from "@/atoms/userAtoms";

const MainMyBefore = () => {
  const userName = useRecoilValue(userNameAtom);
  const profileUrl = useRecoilValue(userProfileUrlAtom);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-8">Welcome Back!</h1>
      <p className="text-lg mb-4">Glad to see you again, {userName ? userName : "Guest"}!</p>
      {profileUrl && (
        <img
          src={profileUrl}
          alt="User Profile"
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
      )}
    </div>
  );
};

export default MainMyBefore;
