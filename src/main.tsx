import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './router/App.tsx'

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId = {clientId}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </GoogleOAuthProvider>
)
