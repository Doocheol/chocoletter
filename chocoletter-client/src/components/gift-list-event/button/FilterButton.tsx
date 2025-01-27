import { useRecoilState } from 'recoil';
import { selectedGiftTypeAtom } from '../../../atoms/gift/giftAtoms';

export const FilterButton = () => {
    const [selectedValue, setSelectedValue] = useRecoilState(selectedGiftTypeAtom);

    const options = [
        { id: "all", label: "모든 초콜릿" },
        { id: "general", label: "일반 초콜릿" },
        { id: "special", label: "특별 초콜릿" },
    ];

    return (
    <div className="flex gap-4">
        {options.map((option) => (
        <label
            key={option.id}
            className={`cursor-pointer px-4 py-2 rounded-full border 
            ${
                selectedValue === option.id
                ? "bg-blue-500 text-white border-blue-500 text-sm"
                : "bg-white text-gray-700 border-gray-300 text-sm"
            }`}
        >
            <input
            type="radio"
            name="chip-radio"
            value={option.id}
            checked={selectedValue === option.id}
            onChange={() => setSelectedValue(option.id as "all" | "general" | "special")}
            className="hidden"
            />
            {option.label}
        </label>
        ))}
    </div>
    );
};