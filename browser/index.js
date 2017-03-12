'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Sliders from './sliders.js';

ReactDOM.render(
    <MuiThemeProvider>
        <Sliders />
    </MuiThemeProvider>,
    document.getElementById('app')
);