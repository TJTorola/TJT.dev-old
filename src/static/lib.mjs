export const getDisplayName = WrappedComponent => (
  WrappedComponent.displayName || WrappedComponent.name || 'Component'
);

export const getLocation = () => (
  window.location.hash.length > 0
    ? window.location.hash.slice(1)
    : ''
);
