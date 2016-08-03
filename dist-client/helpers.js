"use strict";
function queriesFinished(state) {
    var queries = 0;
    for (var queryIdx in state.queries) {
        queries++;
        if (state.queries[queryIdx].loading) {
            return false;
        }
    }
    return queries > 0;
}
exports.queriesFinished = queriesFinished;
