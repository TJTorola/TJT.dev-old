import { default as React } from "https://dev.jspm.io/react@16.8";
import { default as ReactDom } from "https://dev.jspm.io/react-dom@16.8";

export const h = React.createElement;
export const Component = React.PureComponent;
export const render = ReactDom.render;
export const unmount = ReactDom.unmountComponentAtNode;
