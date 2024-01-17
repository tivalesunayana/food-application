const mongoose = require("mongoose");

exports.connectDataBase = (DBurl) => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(DBurl)
    .then(() => console.log("DB connection successful!"))
    .catch((e) => {
      console.log(
        `SomeThing went wrong with DataBase. and the error is =  ${e}`
      );
    });
};
