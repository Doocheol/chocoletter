import React from "react";

type GiftProps = {
    nickName: string;
    content: string | null;
    question: string | null;
    answer: string | null;
};

const Gift: React.FC<GiftProps> = ({ nickName, content, question, answer }) => {
    return (
        <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-2xl font-bold mb-6">
                {nickName} 님이 정성 가득 담아 <br />
                보내주신 초콜렛이에요!❣️
            </h1>

            {/* 편지 내용 */}
            <div className="flex flex-col justify-center items-center w-[300px] h-[600px] border-4 border-gray-300 bg-white p-2 rounded-lg">
                {content ? (
                    // content가 있을 경우 content만 표시
                    <div className="flex justify-center items-center h-full">
                        <p className="text-2xl">{content}</p>
                    </div>
                ) : (
                    // content가 없으면 질문과 답을 표시
                    <div className="flex flex-col justify-between w-full h-full">
                        {/* question은 상단에 배치 */}
                        {question && (
                            <p className="flex items-center justify-center h-[100px] text-lg bg-gray-200 rounded-lg">
                                {question}
                            </p>
                        )}

                        {/* answer는 중앙에 배치 */}
                        <div className="flex-grow flex items-center justify-center">
                            {answer && <p className="text-lg">{answer}</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gift;
