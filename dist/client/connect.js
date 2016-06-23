import { connect } from 'react-apollo';
import config from './config';
export default function connectWithMantra(props) {
    const modified = {};
    if (props.mapStateToProps) {
        modified['mapStateToProps'] = (state, ownProps) => props.mapStateToProps(config.context, state, ownProps);
    }
    if (props.mapDispatchToProps) {
        modified['mapDispatchToProps'] = (state, ownProps) => props.mapDispatchToProps(config.context, state, ownProps);
    }
    if (props.mapQueriesToProps) {
        modified['mapQueriesToProps'] = (state, ownProps) => props.mapQueriesToProps(config.context, state, ownProps);
    }
    if (props.mapMutationsToProps) {
        modified['mapMutationsToProps'] = (state, ownProps) => props.mapMutationsToProps(config.context, state, ownProps);
    }
    return connect(modified);
}
