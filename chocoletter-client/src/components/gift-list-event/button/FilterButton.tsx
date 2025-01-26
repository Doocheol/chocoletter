import { useRecoilState } from 'recoil';
import { selectedGiftTypeAtom } from '../../../atoms/gift/giftAtoms';

export const FilterButton = () => {
    const [selectedValue, setSelectedValue] = useRecoilState(selectedGiftTypeAtom);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value as 'all' | 'general' | 'special');
    };

    return (
        <div>
        <label>
            <input
            type="radio"
            name="all"
            value="all"
            checked={selectedValue === 'all'}
            onChange={handleChange}
            />
            모든 초콜릿
        </label>
        <label>
            <input
            type="radio"
            name="general"
            value="general"
            checked={selectedValue === 'general'}
            onChange={handleChange}
            />
            일반 초콜릿
        </label>
        <label>
            <input
            type="radio"
            name="special"
            value="special"
            checked={selectedValue === 'special'}
            onChange={handleChange}
            />
            특별 초콜릿
        </label>
        <p>선택된 필터(개발용): {selectedValue}</p>
        </div>
    );
}