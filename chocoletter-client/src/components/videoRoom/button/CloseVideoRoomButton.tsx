import React from 'react';

interface CloseVideoRoomButtonProps {
    onEnd: () => void;
}

const CloseVideoRoomButton: React.FC<CloseVideoRoomButtonProps> = ({ onEnd }) => {

    return (
        <>
            <button onClick={onEnd}>통화 종료</button>
        </>
    );
};

export default CloseVideoRoomButton;