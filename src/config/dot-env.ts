import * as dotenv from 'dotenv';
dotenv.config();


const getDbUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.DBURL_LOCAL;
  } 
};

const Config:any = {
  env: process.env.NODE_ENV,
  DBURL:getDbUrl(),
  JWT_KEY: process.env.JWT_KEY,
  defaultExpiryTime: process.env.KEYEXPIRY,
  apiURL:process.env.API_URL,
  apiVersion:process.env.API_VERSION,
  port:process.env.PORT
};

export default Config;

