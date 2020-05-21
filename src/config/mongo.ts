import { connect } from 'mongoose';
import configDB from './config';

const connectDB = async () => {
  const conn = await connect(
    `xxxxxxx://${configDB.username}:${configDB.password}xxxxx`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  );

  console.log(
    `MongoDB Connected: ${conn.connection.host}`.yellow.underline.bold
  );
};

export default connectDB;
