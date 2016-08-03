"use strict";
var defaultLoading = function (props) {
    throw new Error('Please initialise default loading components or specify one');
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    context: null,
    loadingComponent: defaultLoading,
    apolloClient: null,
    store: null,
};
