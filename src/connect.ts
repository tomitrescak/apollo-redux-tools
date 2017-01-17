// import { connect as reduxConnect } from 'react-redux';
// import React from 'react';

// import config from './config';

// export interface IOptions {
//   pure: boolean;
//   withRef: boolean;
// }


// export default function connectWithContext<T>(mapStateToProps?: Function, mapDispatchToProps?: Function, mergeProps?: Function, options?: IOptions): (component: any) => React.StatelessComponent<T> {
//   const modified = {};

//   if (mapStateToProps) {
//     modified['mapStateToProps'] = (state: any, ownProps: any) => mapStateToProps(config.context, state, ownProps);
//   }
//   if (mapDispatchToProps) {
//     modified['mapDispatchToProps'] = (state: any, ownProps: any) => mapDispatchToProps(config.context, state, ownProps);
//   }
//   if (mergeProps) {
//     modified['mergeProps'] = (state: any, ownProps: any) => mergeProps(config.context, state, ownProps);
//   }

//   return reduxConnect(modified['mapStateToProps'], modified['mapDispatchToProps'], modified['mergeProps'], options);
// }

// connectWithContext.contextTypes = config.contextType;
