declare module 'recompose/compose' {
  function hoc(component: any): any;
  export default (...hocs: any[]) => hoc;
}