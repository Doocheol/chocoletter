import { useNavigate } from "react-router-dom";

const GoToMainMyEventButton = () => {
    const navigate = useNavigate();

    const goBackMainMyEvent = () => {
        navigate('/main/my/event')
    }

    return (
        <div>
            <button onClick={goBackMainMyEvent}>내 초콜릿 상자로 돌아가기</button>
        </div>
    )
}

export default GoToMainMyEventButton;