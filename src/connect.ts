import { connect as reduxConnect } from 'react-redux';

import config from './config';

export interface IConnectFunctions {
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

export default function connectWithContext<T>(props: IConnectFunctions): (component: any) => React.StatelessComponent<T> {
  const modified = {};

  if (props.mapStateToProps) {
    modified['mapStateToProps'] = (state: any, ownProps: any) => props.mapStateToProps(config.context, state, ownProps);
  }
  if (props.mapDispatchToProps) {
    modified['mapDispatchToProps'] = (state: any, ownProps: any) => props.mapDispatchToProps(config.context, state, ownProps);
  }
  if (props.mergeProps) {
    modified['mergeProps'] = (state: any, ownProps: any) => props.mergeProps(config.context, state, ownProps);
  }

  return reduxConnect(modified['mapStateToProps'], modified['mapDispatchToProps'], modified['mergeProps'], props.options);
}
