// router.jsx
import { createBrowserRouter } from 'react-router-dom';


// Pages

import Main from '../layout/main';
import Home from '../Home/home';
import Footer from '../Components/Footer/Footer';
import NavBar from '../Components/NavBar/NavBar';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/footer',
        element: <Footer />,
      },
      {
        path: '/navbar',
        element: <NavBar />,
      }
      
    ],
  },
  
]);
