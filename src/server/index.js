/* eslint-disable linebreak-style */

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

con.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

const idC = `'1'`;

app.get('/api/customers', function (req, res) {
  const sql = 'SELECT * FROM customers';
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });
});

app.get('/api/jobs', function (req, res) {
  const sql = 'SELECT * FROM jobs';
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });
});

app.put('/api/scan', (req, res) => {
  // determine if techId and jobId are already scanned in
  const jobId = mysql.escape(req.body.jobId);
  const techId = mysql.escape(req.body.techId);
  const now = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  const selectSql = `${'SELECT * FROM TASKS WHERE idC = 1 and IDJOBS = '}
    ${jobId} and IDPERSON = ${techId} and ENDDATE is NULL`;

  // determine if the tech is already scanned into THIS job
  // get the row id for the tech with a null endDate column

  getRowId(selectSql, (result) => {
    const idForUpdate = result;
    if (typeof idForUpdate === 'string') { // need to follow the scan In flow
      const insertSql = 'INSERT INTO TASKS '
        + ' (idC, idJobs, idPerson, startDate) '
        + ' values ( ' + idC + ', ' + mysql.escape(req.body.jobId)
        + ', ' + mysql.escape(req.body.techId)
        + ", '" + now + "')";
      con.query(insertSql, function (err, result) {
        if (err) throw err;
        res.end(JSON.stringify('scanIn'));
      });
    } else {
      res.end(JSON.stringify('scanOut'));
    }
  });
});

app.put('/api/scanOut', (req, res) => {
  const jobId = mysql.escape(req.body.jobId);
  const techId = mysql.escape(req.body.techId);
  const comment = mysql.escape(req.body.comment);
  let idForUpdate = 'empty';
  const now = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
  const selectSql = `${'SELECT * FROM TASKS WHERE idC = 1 and IDJOBS = '}
    ${jobId} and IDPERSON = ${techId} and ENDDATE is NULL`;

  getRowId(selectSql, (result) => {
    // At this point, the tech has already scanned in and
    // we need to update the enddate time stamp and comment
    idForUpdate = result;
    const clause = `idTasks = ${idForUpdate}`;
    const updateSql = `UPDATE tasks SET endDate =' ${now} ', 
      comments = ${comment} WHERE ${clause}`;
    con.query(updateSql, (err, result2) => {
      if (err) throw err;
      res.end(JSON.stringify('success'));
    });
  });
});

// /api/jobsByCustomer?custId=1
app.get('/api/jobsByCustomer', (req, res) => {
  const id = req.query.custId;
  const sql = `SELECT * FROM jobs WHERE idCustomers = ${mysql.escape(id)}`;
  // eslint-disable-next-line func-names
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });
});

app.post('/api/addCustomer', (req, res) => {
  const custLN = req.query.custLastName;
  const custFN = req.query.custFirstName;
  const custA = req.query.custAddress;
  const custC = req.query.custCity;
  const custS = req.query.custState;
  const custZ = req.query.custZip;
  const sql = `${'INSERT INTO CUSTOMERS '
    + ' (idC, nameLast, '
    + ' nameFirst, '
    + ' address, '
    + ' city, '
    + ' state, '
    + ' zip) '
    + ' values '
    + ' ( 1, '}${mysql.escape(custLN)},${
    mysql.escape(custFN)},${
    mysql.escape(custA)},${
    mysql.escape(custC)},${
    mysql.escape(custS)},${
    mysql.escape(custZ)})`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });
});

app.post('/api/editCustomer', (req, res) => {
  // accept update to customer
  const custId = req.query.customerId;
  const custLN = req.query.custLastName;
  const custFN = req.query.custFirstName;
  const custAddr = req.query.custAddress;
  const custCity = req.query.custCity;
  const custState = req.query.custState;
  const custZip = req.query.custZip;
  const sql = `${'UPDATE CUSTOMERS SET '
    + ' nameFirst = '}${mysql.escape(custFN)
    }, nameLast = ${mysql.escape(custLN)
    }, address = ${mysql.escape(custAddr)
    }, city = ${mysql.escape(custCity)
    }, state = ${mysql.escape(custState)
    }, zip = ${mysql.escape(custZip)
    } WHERE IDCUSTOMERS = ${
    mysql.escape(custId)}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });
});

app.get('/api/customer', function (req, res) {
  const id = req.query.custId;
  const sql = 'SELECT * FROM customers WHERE idCustomers = ' + mysql.escape(id);
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });
});

app.get('/api/job', function (req, res) {
  const id = req.query.jobId;
  const sql = 'SELECT * FROM jobs WHERE idJobs = ' + mysql.escape(id);
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });
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
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
  }


});

app.post('/addJob', function (req, res) {
  const cId = req.body.custId;
  const jDesc = req.body.jobDesc;
  const pId = req.body.personId;

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
    res.end(JSON.stringify(result));
  });
});

// /api/partsByJob?jobId=1
app.get('/api/partsByJob', (req, res) => {
  const id = req.query.jobId;
  const sql = `SELECT * FROM parts WHERE idJobs = ${mysql.escape(id)}`;
  // eslint-disable-next-line func-names
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });
});

// /api/tasksByJob?jobId=1
app.get('/api/tasksByJob', (req, res) => {
  const id = req.query.jobId;
  const sql = `SELECT * FROM tasks WHERE idJobs = ${mysql.escape(id)}`;
  // eslint-disable-next-line func-names
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });
});

app.post('/addTask', function (req, res) {
  const jId = req.body.jobId;
  const pId = req.body.personId;
  const sDate = req.body.startDate;
  const eDate = req.body.endDate;

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

  con.query(sql, function (err, result) {
    if (err) throw err;
    res.end(JSON.stringify(result));
  });

});

function getRowId(sql, callback) {
  con.query(sql, (err, result) => {
    if (err) throw err;
    return (result.length > 0) ? callback(result[0].idTasks) : callback('null');
  });
}
/*app.post('/process_post', urlencodedParser, function (req, res) {
	response = {
		first_name: req.body.first_name,
		last_name: req.body.last_name
	};
	res.end(JSON.stringify(response));
})*/

const server = app.listen(8081, function () {
  const host = server.address().address
  const port = server.address().port

  console.log("listening at http://%s:%s", host, port)
})