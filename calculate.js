const calculate = (number) => {
    const reqQuantity = number 
        ? number
        : 10000;

    const arrayRandoms = [];

    const numberCounterArray = [];

    for (let i = 1; i < reqQuantity; i++) {

        arrayRandoms.push(Math.floor(Math.random() * 1000));

    };

    for (let j = 0; j < arrayRandoms.length - 1; j++) {

        const filterArray = arrayRandoms.filter(num => num == arrayRandoms[j]).length;

        const actualIterator = {

            [arrayRandoms[j]]: filterArray

        }

        numberCounterArray.push(actualIterator);

    };

    return numberCounterArray;
};

export default calculate;

