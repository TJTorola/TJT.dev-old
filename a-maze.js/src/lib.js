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
  GENERATOR: '#/$generator',
  SOLVER: '#/$generator/$solver',
}

export const getRoute = () => {
  const { hash } = window.location;
  if (hash === '') return {
    key: 'INDEX',
    route: '',
    params: {}
  };

  const hashSegments = hash.split('/');
  const key = Object.keys(ROUTES).find(key => {
    const route = ROUTES[key];

    if (route.split('/').length !== hashSegments.length) return false;

    return route.split('/').every((segment, idx) => (
      segment.startsWith('$') ? true : segment === hashSegments[idx]
    ));
  });

  if (!key) return {
    key: 'NOT_FOUND',
    route: hash,
    params: {}
  };

  const params = ROUTES[key].split('/').reduce((acc, segment, idx) => (
    segment.startsWith('$')
      ? {
        ...acc,
        [segment.slice(1)]: hashSegments[idx]
      } : acc
  ), {});

  return {
    key,
    route: hash,
    params
  };
};

export const generateRoute = (route, params = {}) => {
  const current = getRoute();
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
