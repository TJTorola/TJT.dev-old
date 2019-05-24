import { default as React } from "https://dev.jspm.io/react@16.8";
import { default as ReactDom } from "https://dev.jspm.io/react-dom@16.8";

export const createContext = React.createContext;
export const forwardRef = React.forwardRef;
export const Fragment = React.Fragment;
export const h = React.createElement;
export const render = ReactDom.render;
export const unmount = ReactDom.unmountComponentAtNode;
export const useCallback = React.useCallback;
export const useContext = React.useContext;
export const useEffect = React.useEffect;
export const useLayoutEffect = React.useLayoutEffect;
export const useRef = React.useRef;
export const useReducer = React.useReducer;
export const useState = React.useState;

export const composeContext = (contexts, children) =>
  contexts.reduce(
    (acc, [context, value]) => h(context.Provider, { value }, acc),
    children
  );
