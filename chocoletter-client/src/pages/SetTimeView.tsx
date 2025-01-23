import { GoBackButton } from "../components/common/GoBackButton";
import goBackIcon from "../assets/images/button/go_back_button.png";

// 이 부분은 연습 페이지입니다. 기존 (혹은 추후) LetterViewrk 가 모두 대체할 예정이므로, 안 봐도 됩니다.
const ExamplePage = () => {
	return (
		<div className="relative h-full">
			{/* <GoBackButton imageUrl={goBackIcon} altText="뒤로가기 버튼" /> */}
			<h1 className="text-center">현재 페이지</h1>
		</div>
	);
};

export default ExamplePage;
