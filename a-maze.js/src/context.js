import { createContext } from 'react';

import { getCurrentRoute } from './lib.js';

export const RouteContext = createContext(getCurrentRoute());
