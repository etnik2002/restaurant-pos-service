const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); 
  });
  
} else {
  const express = require("express");
  const app = express();
  const mongoose = require("mongoose");
  const cors = require("cors");
  const bodyParser = require("body-parser");
  const session = require('express-session');
  const MongoStore = require('connect-mongo');
  require("dotenv").config();

  const categoryRoutes = require("./routes/category");
  const extrasRoutes = require("./routes/extras");
  const floorRoutes = require("./routes/floor");
  const orderRoutes = require("./routes/order");
  const productRoutes = require("./routes/product");
  const restaurantRoutes = require("./routes/restaurant");
  const tableRoutes = require("./routes/table");
  const userRoutes = require("./routes/table");
  const waiterRoutes = require("./routes/waiter");
  var cookieParser = require('cookie-parser');

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });





  app.use(bodyParser.urlencoded({ extended: true }));
   
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cookieParser(process.env.OUR_SECRET));

  // app.use(cors({
  //   origin: ['http://localhost:4462', 'https://admin-hakbus.vercel.app']
  // }))

  app.use(session({
    secret: process.env.OUR_SECRET,
    resave: false,
    saveUninitialized: false
  }));

  app.use(
    session({
      secret: process.env.OUR_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL,
      }),
    })
  );

  mongoose.connect(process.env.DATABASE_URL)
    .then(() => { console.log("Connected to database!") })
    .catch((err) => { console.log("Connection failed!", err) });

  app.get('/', (req,res) => {
      res.json({message: "POS API"})
  })

  app.use('/category', categoryRoutes);
  app.use('/extras', extrasRoutes);
  app.use('/floor', floorRoutes);
  app.use('/order', orderRoutes);
  app.use('/product', productRoutes);
  app.use('/restaurant', restaurantRoutes);
  app.use('/table', tableRoutes);
  app.use('/user', userRoutes);
  app.use('/waiter', waiterRoutes);


  const PORT = process.env.PORT || 4444;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} listening on http://localhost:${PORT}`);
  });
}
