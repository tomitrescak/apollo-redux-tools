import { compose as mantraCompose } from 'mantra-core';
import config from './config';
export default function compose(composer, loadingComponent) {
    return mantraCompose((ownProps, onData) => composer(config.context, ownProps, onData));
}
