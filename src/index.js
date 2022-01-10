/*
 * @Author: lijunwei
 * @Date: 2021-11-15 17:24:19
 * @LastEditTime: 2021-12-14 17:13:29
 * @LastEditors: lijunwei
 * @Description: 
 */
import React from 'react';
import ReactDOM from 'react-dom';
// import reportWebVitals from './reportWebVitals';
import App from './App';
import '@shopify/polaris/build/esm/styles.css';
import "./index.scss"

// import "../src/mock/index";



ReactDOM.render(
  // <React.StrictMode>
      <App />
  // </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
