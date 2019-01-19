Database: 
This project uses a local mysql connection on 3306

Usage: 
https://localhost/index2.htm (index.htm has unit testing forms)

addCustomer.htm is the test form for creating a customer row in the db

Routers: 
/customers
shows all the customers, returns json

/customer
accepts parameters to edit or view one customer, parm: custId
post is: /customers&action=edit


/jobs
shows all jobs

/jobsByCustomer
shows job for idCust passed to it

/addCustomer
inserts customer into db
the idCustomer is auto increment in the db, do not pass this column to router

Next todo:
figure out a unit tester
make table rows clickable, customer, jobs

add update job api, called from jobs page


show tasks for one job is not working
