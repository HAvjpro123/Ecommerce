import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="963466160863-v471qkpjl7t8gq78h0pmj9chcq3g08u8.apps.googleusercontent.com">
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </GoogleOAuthProvider>

  </BrowserRouter>,
)
