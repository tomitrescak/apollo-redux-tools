import { connect } from 'react-apollo';
import config from './config';

interface IConnectFunctions {
  mapStateToProps?: Function;
  mapDispatchToProps?: Function;
  mapQueriesToProps?: Function;
  mapMutationsToProps?: Function;
}

export default function connectWithMantra(props: IConnectFunctions): any {
  const modified = {};
  if (props.mapStateToProps) {
    modified['mapStateToProps'] = (state: any, ownProps: any) => props.mapStateToProps(config.context, state, ownProps);
  }
  if (props.mapDispatchToProps) {
    modified['mapDispatchToProps'] = (state: any, ownProps: any) => props.mapDispatchToProps(config.context, state, ownProps);
  }
  if (props.mapQueriesToProps) {
    modified['mapQueriesToProps'] = (state: any, ownProps: any) => props.mapQueriesToProps(config.context, state, ownProps);
  }
  if (props.mapMutationsToProps) {
    modified['mapMutationsToProps'] = (state: any, ownProps: any) => props.mapMutationsToProps(config.context, state, ownProps);
  }
  return connect(modified);
}
