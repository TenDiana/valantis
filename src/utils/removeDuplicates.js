export function removeDuplicates(arr) {
    const uniqueIds = {};
    const result = [];

    arr.forEach(item => {
        const id = item.id;
        if (!uniqueIds[id] && result.length !== 50) {
            result.push(item);
            uniqueIds[id] = true;
        }
    });

    return result;
}
