import { connect as apolloConnect } from 'react-apollo';
import { connect as reduxConnect } from 'react-redux';
import config from './config';

interface IConnectFunctions {
  mapStateToProps?: Function;
  mapDispatchToProps?: Function;
  mapQueriesToProps?: Function;
  mapMutationsToProps?: Function;
  mergeProps?: Function;
  options?: {
    pure: boolean;
    withRef: boolean;
  };
}

export default function connectWithContext(props: IConnectFunctions): any {
  const modified = {};
  let needsApollo = false;

  if (props.mapStateToProps) {
    modified['mapStateToProps'] = (state: any, ownProps: any) => props.mapStateToProps(config.context, state, ownProps);
  }
  if (props.mapDispatchToProps) {
    modified['mapDispatchToProps'] = (state: any, ownProps: any) => props.mapDispatchToProps(config.context, state, ownProps);
  }
  if (props.mergeProps) {
    modified['mergeProps'] = (state: any, ownProps: any) => props.mergeProps(config.context, state, ownProps);
  }
  if (props.mapQueriesToProps) {
    needsApollo = true;
    modified['mapQueriesToProps'] = (state: any, ownProps: any) => props.mapQueriesToProps(config.context, state, ownProps);
  }
  if (props.mapMutationsToProps) {
    needsApollo = true;
    modified['mapMutationsToProps'] = (state: any, ownProps: any) => props.mapMutationsToProps(config.context, state, ownProps);
  }
  return needsApollo ?
    apolloConnect(modified) :
    reduxConnect(modified['mapStateToProps'], modified['mapDispatchToProps'], modified['mergeProps'], props.options);
}
