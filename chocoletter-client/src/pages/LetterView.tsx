import React from "react";
import { GoBackButton } from "../components/common/GoBackButton";
import goBackIcon from "../assets/images/button/go_back_button.png";

const ExamplePage = () => {
    return (
        <div className="relative h-full">
            <GoBackButton imageUrl={goBackIcon} altText="뒤로가기 버튼" />
            <h1 className="text-center">현재 페이지</h1>
        </div>
    );
};

export default ExamplePage;
