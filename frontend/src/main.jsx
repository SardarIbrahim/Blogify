import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import { ConfigProvider } from 'react-avatar'

import { disableReactDevTools } from '@fvilers/disable-react-devtools'

import App from './App.jsx'
import store from './store/store.js'

import './index.css'

if (process.env.NODE_ENV === 'production') disableReactDevTools()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ConfigProvider colors={['burlywood', '#1e1e1e', 'yellow']}>
      <App />
    </ConfigProvider>
  </Provider>
)
