import { compose as mantraCompose } from 'mantra-core';
import config from './config';

export default function compose(composer: Function, loadingComponent: any): any {
  return mantraCompose((ownProps: any, onData: Function) => composer(config.context, ownProps, onData));
}
