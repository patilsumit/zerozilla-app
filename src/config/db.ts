import mongoose from "mongoose";
import Config from "./dot-env";
import logger from "../logger/index";

const clientOption = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  poolSize: 50,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false,
};

// const DBURL = Config.DBURL;
export const connect = () => {
  mongoose
    .connect(Config.DBURL)
    .then(() => {
      logger.info("DB-CONNECTION", `Connected to database!`);
    })
    .catch((err) => {
      logger.error(`Connection failed!`, err);
    });
  process.on("unhandledRejection", (error, p) => {});
};
