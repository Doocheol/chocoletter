import React from 'react';
import { GoBackButton } from "../../common/GoBackButton";
import { GoArrowLeft } from "react-icons/go";

export const GoBackMainMyButton = () => {
    return (
        <GoBackButton icon={<GoArrowLeft />} altText="내 초콜릿 상자" />
    )
}