import { Button } from './components/ui/button';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import PrivateRoute from './PrivateRoute';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

function App() {
  return (
    <>
      <Suspense>
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
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
