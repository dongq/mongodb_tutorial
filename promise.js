const addSum = (a,b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(typeof a !== 'number' || typeof b !== 'number') {
                reject('a,b must be numbers');
            }
            resolve(a+b);
        }, 3000)
    })
}

// addSum(10,20)
//     .then(sum1 => {
//         console.log({sum1})
//         addSum(sum1, 22)
//     })
//     .then(sum2 => console.log({sum2}))
//     .catch((error) => console.log({error}))

const totalSum = async () => {
    try{
        let sum = await addSum(10,12)
        let sum2 = await addSum(sum, '11')
        console.log({sum, sum2})
    } catch(err) {
        if(err) console.log({err})
    }


}

totalSum()