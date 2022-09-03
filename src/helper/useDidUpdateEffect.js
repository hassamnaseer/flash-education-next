import { useEffect, useRef } from 'react'

export default function useDidUpdateEffect(callback, deps) {
    const hasMount = useRef(false);

    useEffect(() => {
        if (hasMount.current) {
            callback()
        } else {
            hasMount.current = true
        }
    }, deps)
}