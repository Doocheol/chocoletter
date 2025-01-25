interface changeDateProps {
    givenDate: string,
    format: string,
    isISO: number,
}

export const changeKSTDate = ({givenDate, format, isISO}: changeDateProps) => {
    // givenDate 형식은 "2025-01-25T02:00:00.000Z" 이여야 함.
    const splitDate = givenDate.split('T')
    const YMD = splitDate[0]
    const Hms = splitDate[1]

    const splitYMD = YMD.split('-')
    const fullYear = splitYMD[0]
    const year = splitYMD[0].substring(2)
    const month = splitYMD[1]
    const day = splitYMD[2]

    const splitHms = Hms.split(':')
    const getHour = () => {
        if (isISO === 1) {
            const numHour = (parseInt(splitHms[0], 10) + 9) % 24;
            return String(numHour).padStart(2, '0');
        } else {
            return splitHms[0]
        }
    }
    const hour = getHour();
    const minute = splitHms[1]
    const second = splitHms[2].substring(0, 2)

    return format
        .replace('YYYY', fullYear)
        .replace('yy', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hour)
        .replace('mm', minute)
        .replace('ss', second)
}