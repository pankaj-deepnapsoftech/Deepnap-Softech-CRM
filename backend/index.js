const express = require("express");
const cookieParser = require('cookie-parser');
const {Server} = require('socket.io');
const {createServer} = require('http');
require("dotenv").config();
const cors = require("cors");
const cron = require('node-cron');

const connectDB = require("./utils/connectDB");
const { errorMiddleware } = require("./helpers/error");
const authRoutes = require("./routes/auth/routes");
const companyRoutes = require("./routes/company/routes");
const peopleRoutes = require("./routes/people/routes");
const customerRoutes = require("./routes/customer/routes");
const leadRoutes = require("./routes/lead/routes");
const productRoutes = require("./routes/product/routes");
const categoryRoutes = require("./routes/category/routes");
const expenseRoutes = require("./routes/expense/routes");
const expenseCategoryRoutes = require("./routes/expense category/routes");
const offerRoutes = require("./routes/offer/routes");
const proformaInvoiceRoutes = require("./routes/proforma invoice/routes");
const invoiceRoutes = require("./routes/invoice/routes");
const paymentRoutes = require("./routes/payment/routes");
const dashboardRoutes = require("./routes/dashboard/routes");
const adminRoutes = require("./routes/admin/routes");
const reportRoutes = require("./routes/report/routes");
const websiteCofigurationRoutes = require("./routes/website configuration/routes");
const supportRoutes = require("./routes/support/routes");
const settingRoutes = require("./routes/setting/routes");
const notificationRoutes = require("./routes/notification/routes");

const { isAuthenticated } = require("./controllers/auth/controller");
const { checkAccess } = require("./helpers/checkAccess");
const createNotifications = require("./helpers/createNotifications");
const { socketAuthenticator } = require("./helpers/socket");

const PORT = process.env.PORT;

// Define your allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://deepnapcrm.deepmart.shop",
  "https://subscription.deepnapsoftech.com"
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Authorization,Content-Type",
  preflightContinue: false,
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  exposedHeaders: ["Content-Disposition"],
  credentials: true
};

const app = express();
const server = createServer(app);
const io = new Server(server, {cors: corsOptions});

app.set("io", io);
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/company", isAuthenticated, checkAccess, companyRoutes);
app.use("/api/people", isAuthenticated, checkAccess, peopleRoutes);
app.use("/api/customer", isAuthenticated, checkAccess, customerRoutes);
app.use("/api/lead", isAuthenticated, checkAccess, leadRoutes);
app.use("/api/product", isAuthenticated, checkAccess, productRoutes);
app.use("/api/category", isAuthenticated, checkAccess, categoryRoutes);
app.use("/api/expense", isAuthenticated, checkAccess, expenseRoutes);
app.use(
  "/api/expense-category",
  isAuthenticated,
  checkAccess,
  expenseCategoryRoutes
);
app.use("/api/offer", isAuthenticated, checkAccess, offerRoutes);
app.use(
  "/api/proforma-invoice",
  isAuthenticated,
  checkAccess,
  proformaInvoiceRoutes
);
app.use("/api/invoice", isAuthenticated, checkAccess, invoiceRoutes);
app.use("/api/payment", isAuthenticated, checkAccess, paymentRoutes);
app.use("/api/dashboard", isAuthenticated, checkAccess, dashboardRoutes);
app.use("/api/admin", isAuthenticated, checkAccess, adminRoutes);
app.use("/api/report", isAuthenticated, checkAccess, reportRoutes);
app.use("/api/website-configuration", isAuthenticated, checkAccess, websiteCofigurationRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/notification",isAuthenticated, notificationRoutes);


const emailToSocketId = new Map();

io.use((socket, next)=>{
  cookieParser()(socket.request, socket.request.res, async (err)=> await socketAuthenticator(err, socket, next));
});

io.on('connection', (socket)=>{
  console.log("A user connected", socket.id)
  emailToSocketId.set(socket.user.email, socket.id);
  
  // socket.on('disconnect', () => {
  //   console.log("User disconnected", socket.id);
  // });
})

app.use(errorMiddleware);

// Runs everyday at 12:00 am
cron.schedule("0 0 * * *", createNotifications)

server.listen(PORT, () => {
  connectDB();
  console.log("Server is listening on Port:", PORT);
});

exports.emailToSocketId = emailToSocketId;