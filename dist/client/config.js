const defaultLoading = (props) => {
    throw new Error('Please initialise default loading components or specify one');
};
export default {
    context: null,
    loadingComponent: defaultLoading,
    apolloClient: null
};
