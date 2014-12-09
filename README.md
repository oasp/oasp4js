Sample Application
===
 

The sample application is built on top of the [application template](https://github.com/oasp/oasp4js-app-template) and [oasp4js extensions](https://github.com/oasp/oasp4js) showing their usage scenarios.







Getting Started
---
To get started you simply need to create a specific folder structure, clone repositories for server writen in java, clone repository for client and set up a Tomcat web server.







Install prerequisites
---



You need a Git client to clone the repositories and the Node.js platform (including its package manager - npm) which allows Grunt and Bower to install the dependencies and build the application. [Here](https://github.com/oasp/oasp4js-app-template/wiki/Prerequisites) you can learn how to install the prerequisites. 
Install also Tomcat on your machine. We assume in this example that the Tomcat installation location is 



```
 '<tomcat_dir>'
```




Prepare folder structure
---



Create directories :


	<oasp_dir> 
           | 
		   |‾‾‾ java
		   |
            ‾‾‾ js
 



Set up the server part of the application
-----

* Open command prompt and go to \java folder

```  

    cd <oasp_dir>\java 

```


* Clone the server application repository using Git. In command prompt type:

```  

    git clone https://github.com/oasp/oasp4j.git

    git clone https://github.com/oasp/oasp4j-sample.git 


```

* Now install the oasp4j - java component. Open command prompt and type:


```  
 
    cd <oasp_dir>\java\oasp4j 

    mvn clean install 

```


* Now install the oasp4j-sample - java component. Open command prompt and type:



```
 
    cd <oasp_dir>\java\oasp4j-sample 
 
    mvn clean install

```


* A file 'oasp4j-example-application.war' should appear in the following location: 

``` 
<oasp_dir>\java\oasp4j-sample\oasp4j-example-application\target
```


* Copy the 'oasp4j-example-application.war' file to 

```
<tomcat_dir>\webapps
```

Set up the Tomcat web server
---


* Set up Tomcat users

Edit the '<tomcat_dir>\conf\tomcat-users.xml' file. Add the following roles and user passwords to it: 



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









Set up the client part of the application
-----



Now go to the '\js' folder - open command prompt and type: 	

  



``` 

    cd <oasp_dir>\js 

    git clone https://github.com/oasp/oasp4js-sample.git 

```


Now install dependencies -  go to the oasp4js-sample root directory: 

```
    cd <oasp_dir>\js\oasp4js-sample

    npm install
```


Summary
-----



Now the whole project structure should look like that:



	
		<oasp_dir> 
	              | 
			      |‾‾‾ java
				  |		|
				  |		|‾‾‾ oasp4j
				  |		|
	     		  |	     ‾‾‾ oasp4j-sample
				  |  
	               ‾‾‾ js
					    |
     			         ‾‾‾ oasp4js-sample

Start the application
=============



Execute the following file in order to start Tomcat: 

```
<tomcat_dir>\bin\startup.bat 
```


All commands which are listed below must be executed in the root directory of the project 'oasp4js-sample'. Open command prompt and type:

```
cd <oasp_dir>\js\oasp4js-sample
```


Start the application (during development)
-----



Start the application using Grunt:



``` 

    grunt serve

```



The above-mentioned Grunt's task opens the application in your default browser (http://localhost:9000/oasp4j-example-application/) and watches for any changes in HTML/JavaScript/CSS files. Once you make one, the page is reloaded automatically! 



Start the application (builds a version which is ready for distribution/deployment)
-----



Build the application using Grunt:



``` 

    grunt serve:dist

```



The above-mentioned Grunt's task creates the '<oasp_dir>\js\oasp4js-sample\dist' directory and puts all HTML documents, CSS files (compiled from Less files) and JavaScript files (merged, minimized and obfuscated) there. The content of the aforementioned 'dist' directory is ready to be deployed to a web server. 














