import { Suspense,lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import PrivateRoute from './PrivateRoute';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

const History = lazy(() => import('./pages/History'))
const Report = lazy(() =>import('./pages/Report'))
import FallbackLoading from './components/loader/FallbackLoading';

function App() {
  return (
    <>
      <Suspense fallback={<FallbackLoading />}>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Report />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
