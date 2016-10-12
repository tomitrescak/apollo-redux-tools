import * as React from 'react';
import config from './config';

interface ILoader {
  keys: string[];
  Component: React.StatelessComponent<any>;
  componentWillMount: Function;
  componentDidMount: Function;
  componentWillUpdate: Function;
  componentDidUpdate: Function;
  componentWillReceiveProps: Function;
  componentWillUnmount: Function;
}

class Loader extends React.Component<ILoader, {}> {
  // check if all queries has finished

  // wait for individual queries
  render() {
    const { keys, Component } = this.props;

    if (keys && keys.length) {
      for (let key of keys) {
        if (!this.props[key]) {
          console.error('Key does not exist in the apollo result set: ' + key);
        }

        if (this.props[key].errors) {
          if (Array.isArray(this.props[key].errors)) {
            for (let error of this.props[key].errors) {
              if (error['message']) {
                console.error(error['message']);
              }
              console.error(error);
            }
          } else {
            let m = this.props[key].errors;
            if (m.networkError) {
              console.error(m.networkError.message);
              console.error(m.networkError.stack);
            } else if (m.message) {
              console.error(m.message);
              console.error(m.stack);
            } else {
              console.error(m);
            }
          }
        }
      }
    }
    try {
      return <Component {... this.props} />;
    } catch (ex) {
      console.error(ex.stack);
      throw ex;
    }
  }

  // shouldComponentUpdate(nextProps: any, nextState: any) {
  //   if (this.props.shouldComponentUpdate) {
  //     return this.props.shouldComponentUpdate(nextProps, nextState);
  //   }
  // }

  componentWillUpdate(nextProps: any, nextState: any) {
    if (this.props.componentWillUpdate) {
      this.props.componentWillUpdate();
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.props.componentDidUpdate) {
      this.props.componentDidUpdate();
    }
  }

  componentWillUnmount() {
    if (this.props.componentWillUnmount) {
      this.props.componentWillUnmount();
    }
  }

  componentWillMount() {
    if (this.props.componentWillMount) {
      this.props.componentWillMount();
    }
  }

  componentWillReceiveProps(props: any) {
    if (this.props.componentWillReceiveProps) {
      this.props.componentWillReceiveProps(props);
    }
  }

  componentDidMount() {
    if (this.props.componentDidMount) {
      this.props.componentDidMount();
    }
  }
}

const LoaderContainer = (component: any, mapProps: Function) => {
  return (props: any) => {
    const extraProps = mapProps ? mapProps(config.context, props) : {};
    return (
      <Loader Component={component} {...extraProps} {...props} />
    );
  };
};

export default LoaderContainer;
