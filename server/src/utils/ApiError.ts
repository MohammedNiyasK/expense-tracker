class ApiError extends Error {
  status!: number;
  constructor({ message, status }: { message: string; status: number }) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export { ApiError };
