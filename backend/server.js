require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose").default;
const recipeRoutes = require("./routes/recipes");
const userRoutes = require("./routes/user");

// express app
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

// middleware
app.use(express.json({ limit: "50mb" }));

// routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/user", userRoutes);

// connect to db
const port = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
    // listen to port
    app.listen(port, () => {
      console.log(`listening for requests on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
