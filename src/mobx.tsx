import * as React from 'react';
import config from './config';
import { observer } from 'mobx-react';

export default function connect<C>(mapStateToProps: (state: any, ownProps?: any, context?: any) => Object) {
  return function wrapWithConnect<P>(WrappedComponent: React.ComponentClass<P> | React.StatelessComponent<P>): React.StatelessComponent<C> {

    const func = (props: any, context: any) => <WrappedComponent {...props} { ...mapStateToProps(context.state, props, context) } />;
    func.displayName = `Connect(${WrappedComponent.displayName || 'Component'})`;
    func.contextTypes = config.contextTypes;
    return observer(func);
  };
}

