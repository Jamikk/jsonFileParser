export function recursiveTreversalTree (obj) {
    let amount = 0;

    function recursive(obj) {
        for (let key in obj) {
            const node = obj[key];

            if (!obj.hasOwnProperty(key) || !isObject(node)) {
                continue;
            }

            amount += 1;
            recursive(node);
        }
    }

    recursive(obj);
    return amount;
}


function isObject (value) {
    return typeof value === 'object'
        && value.constructor.name === 'Object';
}


// TODO Не забыть написать тесты
