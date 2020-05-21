import app from './app';

// PORT
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue
      .underline.bold
  );
});

// Handle unhandle promise rejections
process.on('unhandledRejection', async (source) => {
  if (source instanceof Error) {
    console.error(`Unhandled rejection promise:
    message: ${source.message}.red
    stack: ${source.stack}`);
    server.close(() => process.exit(1));
  }
});
