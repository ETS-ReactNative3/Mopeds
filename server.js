var express = require('express');
var app = express();
require('dotenv').config()
var bodyParser = require('body-parser');
var mysql = require('mysql');
var urlencodedParser = bodyParser.urlencoded({extended: false })
var dateFormat = require('dateformat');
var fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/libraries/'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var con = mysql.createConnection({ 
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PWD,
	database: process.env.DB_NAME
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
})

app.get('/header.html', function(req,res) {
	res.sendFile(__dirname + "/" + "header.html" );
})
app.get('/index.htm', function(req,res) {
	res.sendFile(__dirname + "/" + "index.htm" );
})
app.get('/index2.htm', function(req,res) {
	res.sendFile(__dirname + "/" + "index2.htm" );
})
app.get('/jobs.htm', function(req,res) {
	res.sendFile(__dirname + "/" + "jobs.htm" );
})

app.get('/addCustomer.htm', function(req,res) {
	res.sendFile(__dirname + "/" + "addCustomer.htm" );
})

app.get('/addJob.htm', function(req,res) {
	res.sendFile(__dirname + "/" + "addJob.htm" );
})

app.get('/addTask.htm', function(req,res) {
	res.sendFile(__dirname + "/" + "addTask.htm" );
})
app.get('/qr.html', function(req,res) {
	res.sendFile(__dirname + "/" + "qr.html" );
})
app.get('/scan.html', function(req,res) {
	res.sendFile(__dirname + "/" + "scan.html" );
})
app.post('/customers', function(req,res) {
	var idC = req.body.idC;
	console.log(idC);
	var sql = 'SELECT * FROM customers where idC = ' + mysql.escape(idC);
	con.query(sql, function (err, result) {
		if (err) throw err;
	if (process.env.ENV === 'debug') console.log(result);
	res.end(JSON.stringify(result));
	});
});
	
app.get('/jobs', function(req,res) {
	var sql = 'SELECT * FROM jobs';
	con.query(sql, function (err, result) {
		if (err) throw err;
	if (process.env.ENV === 'debug') console.log(result);
	res.end(JSON.stringify(result));
	});
});	

app.put('/tasks', function(req,res) {
	// accepts request to clock into or out of a job 
	// action = scanIn scanOut
	// args: action, jobId, techId
	// put is: /tasks&action=scanIn?jobId=111?techId=222

	if (req.query.action === "scanIn") {
		console.log("inside scanin");
		// insert new job task row to start scan in
		// get mysql date format for current time
		var now = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
		var sql = "INSERT INTO TASKS " + 
			" (idJobs, " + 
			" idPerson, " +
			" startDate) " +
			" values " +  
			" ( " + mysql.escape(req.query.jobId) + "," +
			mysql.escape(req.query.techId) + ",'" +
			now + "')";  
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (process.env.ENV === 'debug') console.log(result);
			res.end(JSON.stringify(result));
		});
	};
	if (req.query.action === "scanOut") {
		// todo this works if there is a row with a null endDate, 
		// if there are no rows with a null endDate, it pukes, needs error
		// handling for that scenario. 
		//
		// update job task row to scan out
		// put is: /tasks&action=scanOut?jobId=111?techId=222?comments=someworkhappened
		// get mysql date format for current time. 
		var now = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

		// get the row id for the tech with a null endDate column
		var userId = mysql.escape(req.query.techId);
		var jobId = mysql.escape(req.query.jobId);
		var clause = 'idJobs = ' + jobId + ' and idPerson = ' + userId + ' and endDate is null';
		var sql = 'SELECT idTasks FROM TASKS WHERE ' + clause;
		
		// update the row with the current date time
		var idForUpdate = 'empty';

		// call function to get idTask for the update below
		// used a function here to pass the async first call result to 
		// next update statement, otherwise the result was not seen by
		// the second update sql. 
		getInfo(sql, function(result){
			idForUpdate = result;
			if (process.env.ENV == "debug") console.log("idForUpdate: " + idForUpdate);
			var clause = 'idTasks = ' + idForUpdate;
			var sql = 'UPDATE tasks SET endDate ="'+ now + '" WHERE ' + clause;
			
			con.query(sql, function (err, result) {
				if (err) throw err;
				if (process.env.ENV === 'debug') console.log(sql, result);
				res.end(JSON.stringify(result));
			});
		});
	};
	// handle the async call to retrieve the idtask for the null endDate row
	// returns the idTask of the first row where endDate is null
	function getInfo(sql, callback){
		con.query(sql, function (err, result, fields) {
			if (err) throw err;
			return callback(result[0].idTasks);
		});
	}
});
		
app.post('/jobsByCustomer', function(req,res) {
	  	var idC = req.body.idC;
		var id = req.body.custId;
		if (process.env.ENV === 'debug') console.log(req.body.custId);
		var sql = 'SELECT * FROM jobs WHERE idC = ' + mysql.escape(idC) + ' and idCustomers = ' + mysql.escape(id);
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (process.env.ENV === 'debug') console.log(result);
			res.end(JSON.stringify(result));
		});
	});

app.post('/addCustomer', function(req,res) {
	var idC = req.body.idC;
	var custLN = req.body.custLastName;
	var custFN = req.body.custFirstName;
	var custA = req.body.custAddress;
	var custC = req.body.custCity;
	var custS = req.body.custState;
	var custZ = req.body.custZip;

	var sql = "INSERT INTO CUSTOMERS " +
		" (idC, " +
		" nameLast, " + 
		" nameFirst, " +
		" address, " +
		" city, " +
		" state, " +
		" zip) " + 
		" values " +  
		" ( " + mysql.escape(idC) + "," +
		mysql.escape(custLN) + "," +
		mysql.escape(custFN) + "," +
		mysql.escape(custA) + "," +
		mysql.escape(custC) + "," +
		mysql.escape(custS) + "," +
		mysql.escape(custZ) + ")"; 
	con.query(sql, function (err, result) {
		if (err) throw err;
		if (process.env.ENV === 'debug') console.log(result);
		res.end(JSON.stringify(result));
	});
});	

app.post('/customer', function(req,res) {
// accept update to customer last name if action =edit, 
// else show the cust details
// post is: /customers&action=edit
	var idC = req.body.idC;
	var custId = req.body.custId;
	var custFN = req.body.custFN;
	var custLN = req.body.custLN;
	var custAddr = req.body.custAddr;
	var custCity = req.body.custC;
	var custState = req.body.custS;
	var custZip = req.body.custZ;
	
	if (req.query.action === "edit") {
		
		var sql = "UPDATE CUSTOMERS SET " +
			" idC = " + mysql.escape(idC) +
			", nameFirst = " + mysql.escape(custFN) +
			", nameLast = " + mysql.escape(custLN) +
			", address = " + mysql.escape(custAddr) +
			", city = " + mysql.escape(custCity) +
			", state = " + mysql.escape(custState) +
			", zip = " + mysql.escape(custZip) +
			" WHERE IDC = " + mysql.escape(idC) +
			" AND IDCUSTOMERS = " + mysql.escape(custId);
		if (process.env.ENV === 'debug') console.log(sql);
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (process.env.ENV === 'debug') console.log(result);
			res.end(JSON.stringify(result));
		});
	}
	// TODO this else needs to change to a case or handle the 
	// action=view paramater 
	// as is, a null parm list will display the cust detail
	else {
		var idC = req.body.idC;
		var id = req.body.custId;
		if (process.env.ENV === 'debug') console.log(req.body.custId);
		var sql = 'SELECT * FROM customers WHERE idC = ' + mysql.escape(idC) + ' and idCustomers = ' + mysql.escape(id);
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (process.env.ENV === 'debug') console.log(result);
			res.end(JSON.stringify(result));
		});
	}
});	

app.post('/addPartToJob', function(req,res) {
// Insert part row for job if action =add, 
// post is: /addPartToJob&action=edit
	var jobId = req.query.jobId;
	var personId = req.query.personId;
	var vendor = req.query.vendor;
	var price = req.query.price;
	var quantity = req.query.quantity;
	var dateCreated= dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	var status = "Ordered";
	if (req.query.action === "add") {
		
		var sql = "INSERT INTO PARTS " + 
			" (idJobs, " + 
			" idPerson, " + // the person who ordered the part
			" vendor, " +
			" price, " +
			" quantity, " +
			" status, " +
			" dateCreated) " + 
			" values " +  
			" ( " + mysql.escape(jobId) + "," +
			mysql.escape(personId) + "," +
			mysql.escape(vendor) + "," +
			mysql.escape(price) + "," +
			mysql.escape(quantity) + ",'" + 
			status + "'," + "'" + dateCreated + "')"; 
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (process.env.ENV === 'debug') console.log(result);
			res.end(JSON.stringify(result));
		});			
	}
});	

app.post('/addJob', function(req,res) {
	var idC = req.body.idC;
	var custId = req.body.custId;
	var jDesc = req.body.jobDesc;
	var pId = req.body.personId;
	
	var sql = "INSERT INTO JOBS " +
		" (idC, " +
		" idCustomers, " + 
		" description, " +
		" idPerson) " +
		" values " + 
		" ( " + mysql.escape(idC) + "," +
		mysql.escape(custId) + "," +
		mysql.escape(jDesc) + "," +
		mysql.escape(pId) + ")"; 

	con.query(sql, function (err, result) {
		if (err) throw err;
		if (process.env.ENV === 'debug') console.log(result);
		res.end(JSON.stringify(result));
	});

});			

app.post('/addTask', function(req,res) {
	var jId = req.body.jobId;
	var pId = req.body.personId;
	var sDate = req.body.startDate;
	var eDate = req.body.endDate;
	
	if (process.env.ENV === 'debug') console.log(req.body.custLN);
	
	var sql = "INSERT INTO TASKS " +
		" (idJobs, " + 
		" idPerson, " +
		" startDate, " +
		" endDate) " +
		" values " + 
		" ( " + mysql.escape(jId) + "," +
		mysql.escape(pId) + "," +
		mysql.escape(sDate) + "," +
		mysql.escape(eDate) + ")"; 

	if (process.env.ENV === 'debug') console.log(sql);
	con.query(sql, function (err, result) {
		if (err) throw err;
		if (process.env.ENV === 'debug') console.log(result);
		res.end(JSON.stringify(result));
	});

});			

/* app.post('/process_post', urlencodedParser, function (req, res) {
   response = {
	   first_name:req.body.first_name,
	   last_name:req.body.last_name
	};
	res.end(JSON.stringify(response));
}) */

var https = require('https');

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
https.createServer(options, app).listen(443); 

