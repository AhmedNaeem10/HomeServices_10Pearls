const express = require("express");
var bodyParser = require('body-parser')
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const path = require('path');
const middleware = require('./middleware');

const port = process.env.SERVER_PORT || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(express.json());
// app.use(middleware.decodeToken);

const db = require("./model");
db.sequelize.sync();

// get driver connection
// const dbo = require("./db/conn");
const adminController = require('./controllers/admin');
const userController = require('./controllers/user')
const workerController = require('./controllers/worker')
const jobController = require('./controllers/job')
const serviceController = require('./controllers/service');
const reviewController = require('./controllers/review')


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


app.get("/", (req, res)=>{
  res.json('Server is alive!')
});

// admin usecases
app.post('/adminLogin', adminController.login);
app.post('/adminRegister', adminController.register);
app.post('/workerRegister', adminController.register_worker);
app.post('/addSkill', adminController.add_skill);
app.put('/adminChangePassword/:username/:password', adminController.change_pasword);
app.get('/getServices', serviceController.get_services);
app.get('/checkService/:service', serviceController.check_service);
app.post('/addService', serviceController.add_service)
app.put('/updateJobStatus/:id/:status', jobController.update_status);
app.get('/getJobsByStatus/:status', jobController.get_jobs)

// customer usecases
app.post('/userLogin', userController.login);
app.post('/userRegister', userController.register);
app.post('/updateCustomer/:userid', userController.update_customer);
app.post('/viewServices', userController.get_services);
app.post('/requestJob', jobController.request_job);
app.post('/cancelRequest/:requestid', userController.cancel_request);
app.post('/getUsernames', userController.get_usernames);
app.post('/getEmails', userController.get_emails);
app.get('/getJobsForCustomer/:id/:status', jobController.get_jobs_for_customer)
app.post('/review', reviewController.give_review);

// worker usecases
app.get('/workers', workerController.get_workers);
app.get('/worker/:id', workerController.get_worker_by_id)
app.get('/workersBySkill/:id', workerController.get_worker_by_skill)
app.get('/workersByAvailability', workerController.get_worker_by_availability)
app.get('/workerDetails/:id', workerController.get_worker_details)
app.put('/switchAvailability/:id', workerController.switch_availability);
