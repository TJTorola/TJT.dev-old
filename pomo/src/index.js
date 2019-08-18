import React from 'react';
import ReactDOM from 'react-dom';

import Timer from './timer/index.jsx';
import * as serviceWorker from './serviceWorker.js';

ReactDOM.render(<Timer />, document.getElementById('root'));

serviceWorker.unregister();
