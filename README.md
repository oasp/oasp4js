Sample Application
===
 
The sample application is built on top of the [application template](https://github.com/oasp/oasp4js-app-template) and is an AngularJS application. Some reusable AngularJS modules (e.g. oasp-security, oasp-i18n, etc.) are available in [this repository](https://github.com/oasp/oasp4js-bower) either directly or using the Bower package manager. The sample application needs the [oasp4j](https://github.com/oasp/oasp4j) (Java) backend to be installed.

Getting Started
---

To get started you simply need to clone both the oasp4j and the oasp4js repositories and set up a Tomcat server.

Install prerequisites
---

You need a Git client to clone the repositories and the Node.js platform (including its package manager - npm) which allows Gulp and Bower to install the dependencies and build the application. [Here](https://github.com/oasp/oasp4js-app-template/wiki/Prerequisites) you can learn how to install the prerequisites. 
Also, you need a Tomcat - a container for the oasp4j backend part. Here you can learn how to do it. We assume your Tomcat is installed in: 


```
 '<tomcat_dir>'
```

Create a directory for the sample application
---

```  

    mkdir <oasp_dir>
    cd <oasp_dir>

```

Set up the backend part of the application
-----

* Clone the oasp4j repository:

```  

    git clone https://github.com/oasp/oasp4j.git

```

* Now let Maven build the backend part:


```  
 
    cd oasp4j
    mvn clean install 

```

* After a successful build, the 'oasp4j-sample-server.war' file should appear in the following directory: 

``` 

<oasp_dir>\oasp4j\oasp4j-samples\oasp4j-sample-server\target

```


* Copy the 'oasp4j-sample-server.war' file to 

```
<tomcat_dir>\webapps
```

Set up the Tomcat web server
---

* Set up Tomcat users

Edit the '<tomcat_dir>\conf\tomcat-users.xml' file. Add the following roles and users to it: 

```
<tomcat-users>
  <role rolename="Chief"/>
  <role rolename="Waiter"/>
  <role rolename="Cook"/>
  <role rolename="Barkeeper"/>
  <user password="chief" roles="Chief" username="chief"/>
  <user password="waiter" roles="Waiter" username="waiter"/>
  <user password="barkeeper" roles="Barkeeper" username="barkeeper"/>
  <user password="cook" roles="Cook" username="cook"/>
</tomcat-users>
```

* Set up Tomcat ports

Edit the '<tomcat_dir>\conf\server.xml' file. 

Set up the port 8081 which is used by our application: 

```
<Connector connectionTimeout="20000" port="8081" protocol="HTTP/1.1" redirectPort="8443"/>
```

* Set up the server part's configuration

Copy to '<tomcat_dir>\lib\config' the 'application.properties' file: 

```
database.user.login = sa
database.user.password =
database.url = jdbc:h2:~/restaurant-db;INIT=create schema if not exists public
database.migration.auto = true
```

Now start the Tomcat: 

```
<tomcat_dir>\bin\startup.bat 
```


Set up the client part of the application
-----

Go back the '<oasp_dir>' directory 

```
cd ..
```

Clone the oasp4j repository:

``` 
    
    git clone https://github.com/oasp/oasp4js.git 

```


Install dependencies: 

```
    cd oasp4js
    npm install
```

Start the application using Gulp:


``` 

    gulp serve

```

The above-mentioned Gulp's task opens the application in your default browser and watches for any changes in HTML/JavaScript/CSS files. Once you make one, the page is reloaded automatically! 



Start the application (builds a version which is ready for distribution/deployment)
-----


Build the application using Grunt:



``` 

    gulp serve:dist

```


The above Gulp's task creates the '<oasp_dir>\js\oasp4js-sample\dist' directory and puts all HTML documents, CSS files (compiled from Less files) and JavaScript files (merged, minimized and obfuscated) there. The content of the aforementioned 'dist' directory is ready to be deployed to a web server. 














