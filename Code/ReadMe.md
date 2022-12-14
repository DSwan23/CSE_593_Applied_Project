# GENESIS APPLICATION CODE

## Prerequisites
--> MySQL Server is installed (WSL)
--> Redis Server is installed (WSL)
--> NodeJs v16.14.2 is installed (Windows)
--> MySQL Workbench (Windows)
--> Redis Insight (Windows)

I ran both the MySQL and Redis Servers out of the WSL2.0 instance on my windows 10 machine.

### MySQL
You can use this guide, https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database, to setup the MySql Server in WSL. If you run it as a service than you should beable to connect using localhost. 

Once the server is up and running, install MySQL Workbench (https://dev.mysql.com/downloads/workbench/). You will want to upload the genesis_sceanrios database to the server. this can be done as follows:
    1. Open MySQL Workbench
    2. Connect to your server instance by creating a new connection with a username and password of root root (respectively)
    3. Find the Administration tab at the bottom of the Navigator Pane, located to the left of the UI.
    4. In this tab under the MANAGEMENT header, Select the Data Import/Restore item at the bottom of the list
    5. In the center of the UI you should see an option that states "Import frim Self-Contained File", select it, it should be a radio button
    6. In the filepath field next to it select the genesis_scenarios_DB.sql file in the main code directory.
    7. Select the Start Import button at the bottom of this form.
    8. In the Schemas tab, back in the navigator window, you should see the database appear containing the 3 tables. You may need to refresh using the button at the top of this pane.

### Redis
You can use this guide, https://redis.io/docs/getting-started/installation/install-redis-on-windows/, to install the Redis-Server in the WSL instance. Run it as a service, just like the MySQL server. You can access the data with redis by using the CLI that comes with the server install or by using the redis insight tool for more of a GUI application, found at: https://redis.com/redis-enterprise/redis-insight/ 


## Running the Application
### Notes
--> I did not have time to get the front end application to dynamically get the service addresses from the service broker, because of this you will need to run all of the pieces of this application on the same machine.

### Services
Both services can be run through the command line in their project directory, if nodeJs is installed, simply run the "npm run dev" command for each of these in seperate command terminals. Before you do, you will need to configure these services to access your databases, this can be done by entering the information into the config.ts file located at src/config for each of the services. These services should be run using ports 8001 (scenario service) and 8002 (spacecraft service)

### Front End Server
The front end server can be run the same way as the services, simply type "npm run dev" in a command terminal based in the server's project file. This will allow you to bring up the front end react application in a web browser simply by going to localhost:8000. Before you do you may need to update your redis ip address in the config.ts file for this project. It can be found in the src/config folder.

## Tests
Perform the desired crud actions on the scenarios, templates, and spacecraft data from the UI and you should beable to see the services reacting and the data reaching the database. Errors should be returned to you, my need to watch for them using the chrome debugger. Just know this is a the starting place for the application so it is still pretty rough.

## Assistance
This is a complex project if you need assistance putting all the pieces together or the directions are not clear than reach out to me at (719) 660 4657 or by email at dswanso6@asu.edu.

