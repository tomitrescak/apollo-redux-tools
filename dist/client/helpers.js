export function queriesFinished(state) {
    let queries = 0;
    for (let queryIdx in state.queries) {
        queries++;
        if (state.queries[queryIdx].loading) {
            return false;
        }
    }
    return queries > 0;
}
