import config from './config';

export function loadingContainer(component: any, loadingView: any | string[], keys = ['data']) {
  if (Array.isArray(loadingView)) {
    keys = loadingView;
  }

  return function(props: any) {
    for (let key of keys) {
      if (props[key].errors) {
        if (Array.isArray(props[key].errors)) {
          for (let error of props[key].errors) {
            if (error['message']) {
              console.error(error['message']);
            }
            console.error(error);
          }
        } else {
          console.error(props[key].errors);
        }
      }
      if (props[key].loading) {
        return  loadingView ?  loadingView(props) : config.loadingComponent(props);
      }
    }
    try {
      return component(props);
    } catch (ex) {
      console.error(ex.stack);
      throw ex;
    }
  };
};
