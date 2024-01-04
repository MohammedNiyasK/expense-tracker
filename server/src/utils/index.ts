const isValidEmail = (email: string) => {
  const emailPattern = /^\S+@\S+\.\S+$/;
  return emailPattern.test(email);
};

export { isValidEmail };
