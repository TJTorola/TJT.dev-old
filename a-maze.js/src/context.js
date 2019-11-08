import { createContext } from 'react';

import { getRoute } from './lib.js';

export const RouteContext = createContext(getRoute());
