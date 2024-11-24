exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello, this is a function deployed from GitHub!",
    }),
  };
  return response;
};
