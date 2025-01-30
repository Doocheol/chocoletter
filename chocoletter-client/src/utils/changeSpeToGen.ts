export const changeSpeToGen = (unboxingTime: string) => {
    const changeDate = async () => {
        const checkDate = new Date(unboxingTime);
        const currentDate = new Date()
        if (checkDate >= currentDate) {
            console.log("미완성")
        }
    };

    changeDate();
}