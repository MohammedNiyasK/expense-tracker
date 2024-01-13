import { jwtDecode } from 'jwt-decode';

const isValidToken = (token: string) => {
  if (!token) {
    return false;
  }

  const decoded = jwtDecode(token);

  let expiryTime = decoded.exp;
  if (expiryTime) {
    expiryTime = expiryTime * 1000;
    const currentTime = Date.now();
    return expiryTime > currentTime;
  }
};

export { isValidToken };
