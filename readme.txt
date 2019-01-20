Database: 
This project uses a local mysql connection on 3306

Usage: 
https://localhost/index2.htm (index.htm has unit testing forms)

Terms:
-Client = the organization that licenses this software, the idC is the identifier to keep client information unique. One client has many 
customers. 
-Customer = within a client, they sell services to individuals for service. One customer may have more than one job. 
-Job = an object that work is performed on, a car, a boat, a contract, a house etc.  One job may have more than one task. 
-Task = a work item for a job. Tasks contain the details of the work done, hours, details, links to images. 
-Parts = an item associated with a job, these can be billable or simply a way to link other items to a job.  Althogh the name is parts,
the linked item can be anything to a reference, url, blob etc. 

The db schema has a column idC that is an identifier for each client.  To ensure multi tenancy, the idC is unique for 
each customer. 

Within the schema, each column with an 'id*' is set to auto-increment, no not reference or pass this value on inserts.  This is the 
unique row ID used for updates and deletes. 

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

/jobsByCustomer
Post is: /jobsByCustomer
shows job for customer passed to it
parms: custId

/addCustomer
inserts customer into db

Next todo:
figure out a unit tester
make table rows clickable, customer, jobs
add update job api, called from jobs page
show tasks for one job is not working
