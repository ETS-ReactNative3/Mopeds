Database: 
This project uses a local mysql connection on 3306

Usage: 
https://localhost/index2.htm (index.htm has unit testing forms)

addCustomer.htm is the test form for creating a customer row in the db

Header.html is the navbar imported into each page

Routers: 
/customers
shows all the customers, returns json

/customer
accepts parameters to edit or view one customer, parms: custId, custFN, custLN, custAddr, custC, custS, custZ
post is: /customers?action=edit
The API assumes the UI will pass all prior values in the event the user only updates one field,
otherwise the update statement will update a null value overriding the prior value(s).

/jobs
shows all jobs, not sure this api is useful and might need to be deleted. 

Post is: /jobsByCustomer
shows job for customer passed to it
parms: custId

/addCustomer
inserts customer into db
the idCustomer is auto increment in the db, do not pass this column to router

Next todo:
figure out a unit tester
make table rows clickable, customer, jobs
add update job api, called from jobs page
show tasks for one job is not working
