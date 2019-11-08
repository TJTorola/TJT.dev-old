import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import 'normalize.css/normalize.css';

import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { Root } from './app.js';
import * as serviceWorker from './serviceWorker.js';

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();
