import React from 'react';
import { createRoot } from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom';
import Layout from './Components/LayoutArea/Layout/Layout';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'notyf/notyf.min.css';
import { Provider } from 'react-redux';
import store from './Redux/Store';
import "react-chartjs-2"; 

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
    </Provider>
);

reportWebVitals();
