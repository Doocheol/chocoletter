import React from 'react';
import { GoBackButton } from "../../common/GoBackButton";
import { SlArrowLeft } from "react-icons/sl";

export const GoBackMainMyButton = () => {
    return (
        <GoBackButton icon={<SlArrowLeft size={20} />} altText="내 초콜릿 상자" />
    )
}