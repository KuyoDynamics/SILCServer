(async () => {
  const express = require("express");
  const cors = require("cors");
  const dotenv = require("dotenv");
  const mongoose = require("mongoose");
  const bodyParser = require("body-parser");
  const path = require("path");
  const morgan = require("morgan");
  const { name: app_name } = require("./package.json");
  const {
    watchCollections,
  } = require("./src/helpers/collection_change_stream_watcher");

  //load environment variables
  dotenv.config();

  //mongoose connection instance
  let connection = mongoose.connection;

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "./public")));
  app.use(morgan("common"));

  //user session management
  //set req.user to null for each server request
  app.use("*", function (req, res, next) {
    req.user = null;
    next();
  });

  app.all("/api/*", function (req, res, next) {
    console.log(
      "Mongoose connection readyState: ",
      mongoose.connection.readyState
    );
    if (mongoose.connection.readyState === 0) {
      res.status(503).send("Database connection not available");
    }
    next();
  });

  //configure routing
  app.use("/silc/api/users", require("./src/users/routes/user_router"));
  app.use(
    "/silc/api/auth/login",
    require("./src/authentication/routes/login_router")
  );
  app.use(
    "/silc/api/auth/token",
    require("./src/authentication/routes/token_renew_router")
  );
  app.use(
    "/silc/api/user_roles",
    require("./src/users/routes/user_role_router")
  );
  app.use(
    "/silc/api/user_role_permissions",
    require("./src/users/routes/user_role_permission_router")
  );

  //initialize FCM
  require("./src/helpers/fcm/fcm_manager")
    .fcmInit()
    .then((result) => {
      console.log(
        "[" + app_name + "] ",
        `[Firebase Cloud Messaging App Name: ${result.name}] initialized successfully...`
      );
    })
    .catch((error) => {
      console.log("[" + app_name + "] ", "FCM Error:", error);
    });

  //configure mongoose and database connection options
  const CONNECTION_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    poolSize: 10,
    bufferMaxEntries: 0,
  };

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URL, CONNECTION_OPTIONS);
      //watch collections
      await watchCollections(connection);
      //check if to setup super user
      await createSuperUser();
    } catch (error) {
      console.log(
        `failed to connect to the database on first attempt with error: ${error.message}, retrying in 5s...`
      );
      setTimeout(connectWithRetry, 5000);
    }
  };

  //connect with retry
  connectWithRetry();

  //mongoose connection event listeners
  connection
    .on("disconnecting", () => {
      console.log("losing connection to the database server...");
    })
    .on("disconnected", () => {
      console.log("lost connection to the database server!");
    })
    .on("reconnected", () => {
      console.log("restored connection to the database server!");
    });

  //setup the server
  app.listen(process.env.PORT || 3000, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
})();
