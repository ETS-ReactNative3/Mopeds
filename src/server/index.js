const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const dateFormat = require('dateformat');
const env = 'debug';
const os = require('os');

app.use(express.static('client'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const con = mysql.createConnection({
	host: "localhost",
	user: "dbuser",
	password: "55solutions",
	database: "cavion"
});

const dirName = `${__dirname}/../`;

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
})

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.get('/', function (req, res) {
	console.log('trying route: ', dirName, " + /index.htm");
	res.sendFile(dirName + "/" + "index.htm");
})

app.get('/index.htm', function (req, res) {
	console.log('trying route 2: ', __dirname, " + /index.htm");
	res.sendFile(__dirname + "/" + "index.htm");
})

app.get('/addCustomer.htm', function (req, res) {
	res.sendFile(__dirname + "/" + "addCustomer.htm");
})

app.get('/addJob.htm', function (req, res) {
	res.sendFile(__dirname + "/" + "addJob.htm");
})

app.get('/addTask.htm', function (req, res) {
	res.sendFile(__dirname + "/" + "addTask.htm");
})

app.get('/api/customers', function (req, res) {
	const sql = 'SELECT * FROM customers';
	con.query(sql, function (err, result) {
		if (err) throw err;
		if (env === 'debug') console.log(result);
		res.end(JSON.stringify(result));
	});
});

app.get('/jobs', function (req, res) {
	const sql = 'SELECT * FROM jobs';
	con.query(sql, function (err, result) {
		if (err) throw err;
		if (env === 'debug') console.log(result);
		res.end(JSON.stringify(result));
	});
});

app.put('/tasks', function (req, res) {
	// accepts request to clock into or out of a job 
	// action = scanIn scanOut
	// args: action, jobId, techId
	// put is: /tasks&action=scanIn?jobId=111?techId=222

	if (req.query.action === "scanIn") {
		console.log("inside scanin");
		// insert new job task row to start scan in
		// get mysql date format for current time
		const now = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
		const sql = "INSERT INTO TASKS " +
			" (idJobs, " +
			" idPerson, " +
			" startDate) " +
			" values " +
			" ( " + mysql.escape(req.query.jobId) + "," +
			mysql.escape(req.query.techId) + ",'" +
			now + "')";
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (env === 'debug') console.log(result);
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
		const now = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

		// get the row id for the tech with a null endDate column
		const userId = mysql.escape(req.query.techId);
		const jobId = mysql.escape(req.query.jobId);
		const clause = 'idJobs = ' + jobId + ' and idPerson = ' + userId + ' and endDate is null';
		const sql = 'SELECT idTasks FROM TASKS WHERE ' + clause;

		// update the row with the current date time
		const idForUpdate = 'empty';

		// call function to get idTask for the update below
		// used a function here to pass the async first call result to 
		// next update statement, otherwise the result was not seen by
		// the second update sql. 
		getInfo(sql, function (result) {
			idForUpdate = result;
			if (env == "debug") console.log("idForUpdate: " + idForUpdate);
			const clause = 'idTasks = ' + idForUpdate;
			const sql = 'UPDATE tasks SET endDate ="' + now + '" WHERE ' + clause;

			con.query(sql, function (err, result) {
				if (err) throw err;
				if (env === 'debug') console.log(sql, result);
				res.end(JSON.stringify(result));
			});
		});
	};
	// handle the async call to retrieve the idtask for the null endDate row
	// returns the idTask of the first row where endDate is null
	function getInfo(sql, callback) {
		con.query(sql, function (err, result, fields) {
			if (err) throw err;
			return callback(result[0].idTasks);
		});
	}
});

app.post('/jobsByCustomer', function (req, res) {
	const id = req.body.custId;
	if (env === 'debug') console.log(req.body.custId);
	const sql = 'SELECT * FROM jobs WHERE idJobs = ' + mysql.escape(id);
	con.query(sql, function (err, result) {
		if (err) throw err;
		if (env === 'debug') console.log(result);
		res.end(JSON.stringify(result));
	});
});

app.post('/api/addCustomer', function (req, res) {
	// console.log('addCustomer ', req);
	console.log('addCustomer ', req.body);
	const custLN = req.body.custLastName;
	const custFN = req.body.custFirstName;
	const custA = req.body.custAddress;
	const custC = req.body.custCity;
	const custS = req.body.custState;
	const custZ = req.body.custZip;
	console.log('addCustomer - name: ', custFN, custLN);

	const sql = "INSERT INTO CUSTOMERS " +
		" (nameLast, " +
		" nameFirst, " +
		" address, " +
		" city, " +
		" state, " +
		" zip) " +
		" values " +
		" ( " + mysql.escape(custLN) + "," +
		mysql.escape(custFN) + "," +
		mysql.escape(custA) + "," +
		mysql.escape(custC) + "," +
		mysql.escape(custS) + "," +
		mysql.escape(custZ) + ")";
	con.query(sql, function (err, result) {
		if (err) throw err;
		if (env === 'debug') console.log(result);
		res.end(JSON.stringify(result));
	});
});

app.post('/customer', function (req, res) {
	// accept update to customer last name if action =edit, 
	// else show the cust details
	// post is: /customers&action=edit
	const custId = req.body.custId;
	const custFN = req.body.custFN;
	const custLN = req.body.custLN;
	const custAddr = req.body.custAddr;
	const custCity = req.body.custC;
	const custState = req.body.custS;
	const custZip = req.body.custZ;

	if (req.query.action === "edit") {

		const sql = "UPDATE CUSTOMERS SET " +
			" nameFirst = " + mysql.escape(custFN) +
			", nameLast = " + mysql.escape(custLN) +
			", address = " + mysql.escape(custAddr) +
			", city = " + mysql.escape(custCity) +
			", state = " + mysql.escape(custState) +
			", zip = " + mysql.escape(custZip) +
			" WHERE IDCUSTOMERS = " +
			mysql.escape(custId);
		if (env === 'debug') console.log(sql);
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (env === 'debug') console.log(result);
			res.end(JSON.stringify(result));
		});
	}
	// TODO this else needs to change to a case or handle the 
	// action=view paramater 
	// as is, a null parm list will display the cust detail
	else {
		const id = req.body.custId;
		if (env === 'debug') console.log(req.body.custId);
		const sql = 'SELECT * FROM customers WHERE idCustomers = ' + mysql.escape(id);
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (env === 'debug') console.log(result);
			res.end(JSON.stringify(result));
		});
	}

});

app.post('/addPartToJob', function (req, res) {
	// Insert part row for job if action =add, 
	// post is: /addPartToJob&action=edit
	const jobId = req.query.jobId;
	const personId = req.query.personId;
	const vendor = req.query.vendor;
	const price = req.query.price;
	const quantity = req.query.quantity;
	const dateCreated = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
	const status = "Ordered";
	if (req.query.action === "add") {

		const sql = "INSERT INTO PARTS " +
			" (idJobs, " +
			" idPerson, " +
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
		console.log(sql);
		con.query(sql, function (err, result) {
			if (err) throw err;
			if (env === 'debug') console.log(result);
			res.end(JSON.stringify(result));
		});
	}


});

app.post('/addJob', function (req, res) {
	const cId = req.body.custId;
	const jDesc = req.body.jobDesc;
	const pId = req.body.personId;

	if (env === 'debug') console.log(req.body.custLN);

	const sql = "INSERT INTO JOBS " +
		" (idCustomers, " +
		" description, " +
		" idPerson) " +
		" values " +
		" ( " + mysql.escape(cId) + "," +
		mysql.escape(jDesc) + "," +
		mysql.escape(pId) + ")";

	con.query(sql, function (err, result) {
		if (err) throw err;
		if (env === 'debug') console.log(result);
		res.end(JSON.stringify(result));
	});

});

app.post('/addTask', function (req, res) {
	const jId = req.body.jobId;
	const pId = req.body.personId;
	const sDate = req.body.startDate;
	const eDate = req.body.endDate;

	if (env === 'debug') console.log(req.body.custLN);

	const sql = "INSERT INTO TASKS " +
		" (idJobs, " +
		" idPerson, " +
		" startDate, " +
		" endDate) " +
		" values " +
		" ( " + mysql.escape(jId) + "," +
		mysql.escape(pId) + "," +
		mysql.escape(sDate) + "," +
		mysql.escape(eDate) + ")";

	if (env === 'debug') console.log(sql);
	con.query(sql, function (err, result) {
		if (err) throw err;
		if (env === 'debug') console.log(result);
		res.end(JSON.stringify(result));
	});

});

app.post('/process_post', urlencodedParser, function (req, res) {
	response = {
		first_name: req.body.first_name,
		last_name: req.body.last_name
	};
	res.end(JSON.stringify(response));
})

const server = app.listen(8081, function () {
	const host = server.address().address
	const port = server.address().port

	console.log("listening at http://%s:%s", host, port)
})