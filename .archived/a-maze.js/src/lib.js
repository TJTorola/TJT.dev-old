export const cx = classes => Object.keys(classes).reduce((acc, className) => (
  classes[className] ? [...acc, className] : acc
), []).join(' ');

/**
 *
 * type Route = string
 * example: /o/$organizationId/g/$groupId
 *     Params: {
 *       organizationId: string,
 *       groupId: string,
 *     }
 *
 * type Config = {
 *   routes: {
 *     [routeKey: string]: string
 *   }
 * }
 *
 */

export const ROUTES = {
  SEED: '#/$seed',
  GENERATOR: '#/$seed/$generator',
  SOLVER: '#/$seed/$generator/$solver',
}


export const getCurrentRoute = () => {
  const { hash } = window.location;
  const [ path ] = hash.split('?');
  if (hash === '') return {
    key: 'INDEX',
    params: {}
  };

  const key = getRouteKey(path);

  if (!key) return {
    key: 'NOT_FOUND',
    params: {}
  };

  return {
    key,
    params: getRouteParams(path, key)
  };
};

export const getRouteKey = path => {
  const pathSegments = path.split('/');
  return Object.keys(ROUTES).find(key => {
    const route = ROUTES[key];

    if (route.split('/').length !== pathSegments.length) return false;

    return route.split('/').every((segment, idx) => (
      segment.startsWith('$') ? true : segment === pathSegments[idx]
    ));
  });
}

export const getRouteParams = (path, key) => {
  const pathSegments = path.split('/');
  return ROUTES[key].split('/').reduce((acc, segment, idx) => (
    segment.startsWith('$')
      ? {
        ...acc,
        [segment.slice(1)]: pathSegments[idx]
      } : acc
  ), {});
}

export const getDimensions = () => {
  const { params } = getCurrentRoute();

  return params.seed
    ? params.seed.split('x').map(i => parseInt(i, 10))
    : null;
}

export const getRoute = (route, params = {}) => {
  const current = getCurrentRoute();
  const newParams = Object.assign({}, current.params, params);
  const segments = route.split('/').map(segment => {
    if (segment.startsWith('$')) {
      const param = newParams[segment.slice(1)];
      if (!param) {
        throw new Error(`Could not find param '${segment}' to generate route '${route}'`);
      }
      
      return param;
    } else {
      return segment;
    }
  });

  return segments.join('/');
};
