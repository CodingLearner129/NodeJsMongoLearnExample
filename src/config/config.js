import mongoose from "mongoose";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
dotenvExpand.expand(dotenv.config());
import fs from "fs";
import { tour as tourModel } from "./../models/tourModel.js";
import { review as reviewModel } from "./../models/reviewModel.js";
import { user as userModel } from "./../models/userModel.js";
import { log } from "console";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// get data from .env file
const port = process.env.PORT || "3000";
const host = process.env.HOST || "localhost";
const mongodb = process.env.MONGO_LOCAL_DB;
const mongoClusterDb = process.env.MONGO_CLUSTER_DB;

// if you store data based on schema then you need to set strictQuery to true
// if you store data as per requests not as per defined schema then you need to set strictQuery to false
mongoose.set("strictQuery", true);

// connect to database

// mongoose.connect(mongodb, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log(`Connected to mongodb successfully...`);
// });

mongoose
  // .connect(mongodb, {
  .connect(mongoClusterDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to mongodb successfully...`);
  })
  .catch((err) => {
    console.log(err.name + "💥 : " + err.message);
  });

// mongoose.set("debug", (collectionName, method, query, doc) => {
//   console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
// });

// try {
//     await mongoose.connect(mongodb, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   console.log(`Connected to mongodb successfully...`);
// } catch (error) {
//   // console.log(error);
//   console.log(error.name + "💥 : " + error.message);
// }

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Import data into db
const importData = async () => {
  try {
    // Read JSON file
    const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
    const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));
    const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

    await tourModel.create(tours);
    await reviewModel.create(reviews);
    await userModel.create(users);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

// Delete all data from db
const deleteData = async ()=>{
  try {
    await tourModel.deleteMany();
    await reviewModel.deleteMany();
    await userModel.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

if (process.argv[2] === '--import') {
  importData();
} else if(process.argv[2] === '--delete') {
  deleteData();
}