// const React = require('react');
// const ReactDom = require('react-dom');
// const NumberBaseball = require('./NumberBaseball');
import React, { useState, useRef } from 'react';
import ReactDom from 'react-dom';
import NumberBaseball from './NumberBaseball';

ReactDom.render(<NumberBaseball />, document.querySelector('#root'));