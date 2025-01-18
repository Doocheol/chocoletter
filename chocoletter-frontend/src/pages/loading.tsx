import React from "react";
import "../styles/loading.css"; // CSS 파일 임포트

const Loading: React.FC = () => {
  return (
    <div className="back">
      <div className="center">
        <div className="gift"></div>
        <div className="loadingText">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;
