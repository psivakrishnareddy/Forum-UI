import './App.scss';
import Layout from './components/common/Layout/Layout';
import AppRoutes from './Routes';
import { AuthContextProvider } from './store/context/auth-context';
import { GlobalContextProvider } from './store/context/global-context';
import Toaster from './components/common/UI/Toaster/Toaster';
import { ToastContextProvider } from './store/context/toast-context';
import IdleComponentContainer from './store/context/idle-context';


function App() {
  return (
    <div className="App">
      <GlobalContextProvider>
        <AuthContextProvider>
          <ToastContextProvider>
            <Layout>
              <IdleComponentContainer></IdleComponentContainer>
              <AppRoutes />
            </Layout>
            <Toaster></Toaster>
          </ToastContextProvider>
        </AuthContextProvider>
      </GlobalContextProvider>
    </div>
  );
}

export default App;
