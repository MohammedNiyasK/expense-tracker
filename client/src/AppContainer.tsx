import { useState, useEffect } from 'react';
import axios from 'axios';
import CommonLoading from './components/loader/CommonLoading';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const ErrorComponent = ({ errorMessage }: { errorMessage: string | null }) => (
  <div className="text-red-500 font-bold text-center">{errorMessage}</div>
);

const AppContainer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get('/api/server-status');
      } catch (err) {
        setError('Server is down. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkServerStatus();
  }, []);

  if (loading || error) {
    return (
      <div className="flex items-center justify-center h-screen">
        {loading ? <CommonLoading /> : <ErrorComponent errorMessage={error} />}
      </div>
    );
  }

  return (
    <div>
      <Provider store={store}>
        <App />
      </Provider>
    </div>
  );
};

export default AppContainer;
