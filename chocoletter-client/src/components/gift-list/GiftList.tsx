import React, { useEffect, useState } from "react";
import { GiftOpenButton } from "./button/GiftOpenButton";
import { useFetchChocolates } from "../../hooks/useGetChocolates";
import { changeSpecialToGeneral } from "../../services/giftApi";
import Loading from "../common/Loading";

type FilterType = "all" | "general" | "special";
interface GiftListProps {
	filter: FilterType;
}

export const GiftList: React.FC<GiftListProps> = ({ filter }) => {
    const [refresh, setRefresh] = useState(false);
	const { data: chocolates, isLoading } = useFetchChocolates("all", refresh);
	const [localChocolates, setLocalChocolates] = useState(chocolates);
	const currentTimeUTC = new Date().getTime() - 9 * 60 * 60 * 1000;

    const onChange = () => {
        setRefresh((prev) => !prev)
    }

	// useFetchChocolates의 데이터가 변경되면 localChocolates를 업데이트
	useEffect(() => {
		setLocalChocolates(chocolates);
	}, [refresh, chocolates]);

	// 특별 초콜릿이 지난 시간이 되면 일반 초콜릿으로 변경
	useEffect(() => {
		const eventDay = import.meta.env.VITE_EVENT_DAY;
		const today = new Date();
		const formattedToday = `${String(today.getMonth() + 1).padStart(
			2,
			"0"
		)}${String(today.getDate()).padStart(2, "0")}`;

		if (formattedToday !== eventDay) return;
		if (!chocolates) return;

		chocolates.map(async (choco) => {
			if (choco.giftType === "SPECIAL" && choco.unBoxingTime) {
				const unBoxingUTC = new Date(choco.unBoxingTime).getTime() - 9 * 60 * 60 * 1000 + 60 * 1000;
				if (currentTimeUTC > unBoxingUTC) {
					try {
						const res = await changeSpecialToGeneral(choco.giftId);
						setLocalChocolates((prevChocos) =>
							prevChocos.map((item) =>
								item.giftId === choco.giftId
									? { ...item, giftType: "GENERAL" }
									: item
							)
						);
					} catch (err) {
						console.log(err);
					}
				}
			}
		});
	}, [refresh, chocolates]);

	if (isLoading) {
		return <Loading />; // 로딩 상태 표시
	}

	// props의 giftType과 동일한 초콜릿만 필터링 
	const filteredChocolates = localChocolates.filter((choco) => {
		if (filter === "all") return true;
		return choco.giftType.toLowerCase() === filter;
	});

	return (
		<div>
			{filteredChocolates.length === 0 ? (
				<p className="text-sans text-center justify-center mt-[110px]">
					받은 초콜릿이 없어요...
				</p>
			) : null}
			<div
				className={`w-full grid grid-cols-3 gap-4 overflow-y-auto scrollbar-hidden px-4 py-4 mt-[90px]`}
			>
				{filteredChocolates.map((chocolate) => (
					<GiftOpenButton
						key={chocolate.giftId}
						giftId={chocolate.giftId}
						giftType={chocolate.giftType}
						isOpened={chocolate.isOpened}
						unboxingTime={chocolate.unBoxingTime}
						isAccepted={chocolate.isAccept}
						roomId={chocolate.unBoxingRoomId}
                        onRefresh={onChange}
					/>
				))}
			</div>
		</div>
	);
};
