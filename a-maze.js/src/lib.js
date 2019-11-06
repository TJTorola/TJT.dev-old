/**
 *
 * type Route = string
 * ex: /o/$organizationId/g/$groupId
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

const CONFIG = {
  routes: {
    SEEDED: '#/$seed',
    GENERATOR: '#/$seed/$generator',
    SOLVER: '#/$seed/$generator/$solver',
  }
}

const getRoute = () => {
  const { hash } = window.location;
  if (hash === '') return {
    key: 'INDEX',
    route: '',
    params: {}
  };

  const hashSegments = hash.split('/');
  const key = Object.keys(CONFIG.routes).find(key => {
    const route = CONFIG.routes[key];

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

  const params = CONFIG.routes[key].split('/').reduce((acc, segment, idx) => (
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

const onRouteChange = listener => {
  const _callListener = () => listener(getRoute());
  window.addEventListener("hashchange", _callListener);
  _callListener();
  return () => removeEventListener("hashchange", _callListener);
}
