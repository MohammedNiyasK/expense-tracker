import { Button } from './components/ui/button';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import PrivateRoute from './PrivateRoute';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
      <Suspense>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<Login />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
