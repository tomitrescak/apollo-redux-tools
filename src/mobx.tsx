import * as React from 'react';
import config from './config';
import { observer, PropTypes } from 'mobx-react';

export function connect<C>(mapStateToProps: (state: any, ownProps?: any, context?: any) => Object) {
  return function wrapWithConnect<P>(WrappedComponent: React.ComponentClass<P> | React.StatelessComponent<P>): React.StatelessComponent<C> {

    const func = (props: any, context: any) => <WrappedComponent {...props} { ...mapStateToProps(context.state, props, context) } />;
    func.displayName = `Connect(${WrappedComponent.displayName || 'Component'})`;
    func.contextTypes = config.contextTypes;
    return observer(func) as any;
  };
}

export function provide<C>(...names: string[]) {
  return function provideFromContext<P>(WrappedComponent: React.ComponentClass<P> | React.StatelessComponent<P>): React.StatelessComponent<C> {
    const func = (props: any, context: any) => {
      const extraProps = {};
      for (let name of names) {
        extraProps[name] = context.mobxStores[name];
      }
      return <WrappedComponent {...props} { ...extraProps } />;
    };
    func.displayName = `Connect(${WrappedComponent.displayName || 'Component'})`;
    func.contextTypes = {
      mobxStores: PropTypes.objectOrObservableObject
    };
    return observer(func) as any;
  };
}

