export function convertValueToEnum<E extends Object>(
    enumObj: E,
    value: string,
): E[keyof E] {
    const values = Object.values(enumObj) as Array<E[keyof E]>
    if (!values.includes(value as E[keyof E])) {
        throw new Error(`convertValueToEnum: value is not valid: ${String(value)}`)
    }
    return value as E[keyof E]
}

export function convertValueIndexToEnum<E extends Object>(
    enumObj: E,
    index: number,
): E[keyof E] {
    if (!Number.isInteger(index)) {
        throw new Error(`convertValueToEnum: index must be an integer, got: ${index}`)
    }

    const values = Object.values(enumObj)

    if (index < 0 || index >= values.length) {
        throw new Error(`convertValueToEnum: index out of range: ${index} (0..${values.length - 1})`)
    }

    return values[index]
}
