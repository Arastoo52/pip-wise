/**
 * Async Handler Wrapper for Express Controllers
 * Catches asynchronous errors and forwards them to the global error middleware
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
