export default {
    context: null,
    loadingComponent: (props) => { throw new Error('Please initialise default loading components or specify one'); },
    apolloClient: null
};
