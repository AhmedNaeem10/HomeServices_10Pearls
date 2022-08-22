const db = require("../model");
const customer = require("../model/customer");
require("dotenv").config({ path: "./config.env" });
const transporter = require("./email")

db.sequelize.sync();
const JOB = require('../model/job')(db.sequelize, db.Sequelize);
const CUSTOMER = require('../model/customer')(db.sequelize, db.Sequelize);

exports.request_job = async (req, res) => {

    const job = req.body;
    try{
        let response = await JOB.create(job);
        res.json({
            status: 200,
            message: "Job request successfully submitted!"
        })
    }catch(err){
        res.json({
            status: 400,
            message: err.message
        });
    }
}

exports.request = async(req, res) => {
    let job = req.body;
    const SERVICE_DETAIL = require('../model/service_detail')(db.sequelize, db.Sequelize);
    try{
        let response = await SERVICE_DETAIL.findOne({where: {WORKER_ID: job.WORKER_ID, SERVICE_ID: job.SERVICE_ID}});
        let id = response.id;
        job.SERVICE_DETAIL_ID = id;
        job.PAYMENT_METHOD = "COD";
        job.DATE_TIME = "2022-1-10 " + job.DATE_TIME;
        job.JOB_STATUS = "pending";
        await JOB.create(job);
        res.json({
            status: 200,
            message: "Job request successfully submitted!"
        })
    }catch(err){
        res.json({
            status: 400,
            message: err.message
        });
    }
}


exports.update_status = async (req, res) => {
    const {id, status} = req.params;
    try{
        let response = await JOB.update({JOB_STATUS: status}, {where: {JOB_ID: id}});
        let getCustomer = await JOB.findOne({attributes: ['CUSTOMER_ID']}, {where: {JOB_ID: id}});
        const customerid = getCustomer.dataValues.CUSTOMER_ID;
        let getEmail = await CUSTOMER.findOne( {where: {CUSTOMER_ID: customerid}});
        // console.log(getEmail);
        const customerEmail = getEmail.dataValues.EMAIL;
        // console.log("Email is: ", customerEmail);
        if (customerEmail){
            text = "Dear customer, \n\n The status of your request is now updated to '" + status + "'. \n\nRegards, \nHome Services";
            transporter.sendEmail(customerEmail, "Status update", text);
        }
        if(response){
        res.json({
            status: 200,
            message: "Status successfully updated!"
        })}
    }
    catch(err){
        res.json({
            status: 400,
            message: "There was an error updating the status!."
        });
    }
}


// get all requests that are either pending, accepted or rejected
exports.get_jobs = async (req, res) => {
    try{
        let {status} = req.params;
        let response = await JOB.findAll({where: {JOB_STATUS: status}});
        res.json({
            status: 200,
            message: response
        });
    }catch(err){
        res.json({
            status: 400,
            message: "There was an error getting the jobs!."
        });
    }
}


get_details = async(response) => {
    let customer_id = response.CUSTOMER_ID;
    let service_detail_id = response.SERVICE_DETAIL_ID;
    const CUSTOMER = require('../model/customer')(db.sequelize, db.Sequelize);
    const WORKER = require('../model/worker')(db.sequelize, db.Sequelize);
    const SERVICE_DETAIL = require('../model/service_detail')(db.sequelize, db.Sequelize);
    const SERVICE = require('../model/service')(db.sequelize, db.Sequelize);

    let customer_name = await CUSTOMER.findOne({attributes: ['id', 'FIRST_NAME', 'LAST_NAME']}, {where: {CUSTOMER_ID: customer_id}});
    let CUSTOMER_NAME = customer_name.FIRST_NAME + " " + customer_name.LAST_NAME;

    let service_detail = await SERVICE_DETAIL.findAll({where: {SERVICE_DETAIL_ID: service_detail_id}});
    let service_id = service_detail[0].SERVICE_ID;
    let worker_id = service_detail[0].WORKER_ID;
    // console.log(worker_id);
    const worker_name = await WORKER.findOne({where: {WORKER_ID: worker_id}});
    const WORKER_NAME = worker_name.FIRST_NAME + " " + worker_name.LAST_NAME;
    
    // console.log(WORKER_NAME);
    let service = await SERVICE.findAll({where: {SERVICE_ID: service_id}})

    let JOB_ID = response.id;
    let DATE_TIME = response.DATE_TIME;
    let ADDRESS = response.ADDRESS;
    let JOB_STATUS = response.JOB_STATUS;
    let SERVICE_NAME = service[0].SERVICE_TITLE;
    let CUSTOMER_ID = customer_name.id;
    let WORKER_ID = worker_id;
    return {JOB_ID, CUSTOMER_ID, CUSTOMER_NAME, WORKER_ID, WORKER_NAME, SERVICE_NAME, DATE_TIME, ADDRESS, JOB_STATUS};
}

exports.get_jobs_details = async (req, res) => {
    // try{
        let {status} = req.params;
        let responses = await JOB.findAll({where: {JOB_STATUS: status}});
        let results = []
        for(let response of responses){
            let result = await get_details(response);
            results.push(result);
        }
        res.json({
            status: 200,
            message: results
        });
    // }catch(err){
    //     res.json({
    //         status: 400,
    //         message: "There was an error getting the jobs!."
    //     });
    // }
}

exports.get_jobs_for_customer = async (req, res) => {
    try{
        let {id, status} = req.params;
        let response = await JOB.findAll({where: {CUSTOMER_ID: id, JOB_STATUS: status}});
        res.json({
            status: 200,
            message: response
        });
    }catch(err){
        res.json({
            status: 400,
            message: "There was an error getting the jobs!."
        });
    }
}

exports.get_jobs_for_customer_by_id = async (req, res) => {
    try{
        let {id} = req.params;
        let responses = await JOB.findAll({where: {CUSTOMER_ID: id}});
        let results = []
        for(let response of responses){
            let result = await get_details(response);
            results.push(result)
        }
        
        res.json({
            status: 200,
            message: results
        });
    }catch(err){
        res.json({
            status: 400,
            message: "There was an error getting the jobs!."
        });
    }
}






