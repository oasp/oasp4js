Sample Application [![Build Status](https://travis-ci.org/oasp/oasp4js.svg?branch=development)](https://travis-ci.org/oasp/oasp4js) [![Coverage Status](https://coveralls.io/repos/oasp/oasp4js/badge.svg?branch=development)](https://coveralls.io/r/oasp/oasp4js?branch=development)                                                                                                                
===
 
The sample application is built on top of the [application template](https://github.com/oasp/oasp4js-app-template) and is an AngularJS application. Some of the AngularJS modules (e.g. oasp-security, oasp-i18n, etc.) which can be reused in your application are available in [this repository](https://github.com/oasp/oasp4js-bower) either directly or using the Bower package manager. The sample application needs the [oasp4j](https://github.com/oasp/oasp4j) (Java) server part to be installed.

Getting Started
---

To get started you need to clone the oasp4j repository containing the server part, build and deploy it on a Tomcat server. To get started with the client part you need to clone the oasp4js repository, build the client and start it.

Install prerequisites
---

There are two ways to get sample application working: eighter by getting OASP IDE and running it from there or without installing IDE. 

OASP IDE already contains software (Node.js, Gulp, Bower, Maven) required to run sample application so only Git must be additionally installed.
If OASP IDE is not used additional software must be installed manually so you need a Git client to clone the repositories and the Node.js platform (including its package manager - npm) which allows Gulp and Bower to install the dependencies and build the application. [Here](https://github.com/oasp/oasp4js/wiki/Prerequisites) you can learn how to install the prerequisites. 
Also, for the server part you need Maven (required version: 3.x) to be installed. For installation details please refer to the [Maven's](http://maven.apache.org/download.cgi) home page. 

Create the `<oasp_dir>` directory for the sample application
---

```
mkdir <oasp_dir>
cd <oasp_dir>    
```

Set up the server part of the application
---

Clone the oasp4j repository:

```  
git clone https://github.com/oasp/oasp4j.git
```

Let Maven build the server part:

```  
cd oasp4j
mvn clean install 
```

After a successful build go to the following directory

``` 
cd samples\core\target

```
Start the oasp4j-samples-core project as spring boot application by running following command in your console:

``` 
java -jar oasp4j-sample-core-dev-SNAPSHOT.jar

```

By default tomcat server will use port 8081. This can be changed by creating new application.properties file in <oasp_dir>\oasp4j\oasp4j-samples\core\target directory and adding following entry:

```
server.port=8888.
```
Replace '8888' with the port number which you want to use for your Tomcat.
If you change the Tomcat's port, then see the _[hint about how to configure a different port on the client side](#howToChangeTomcatsPortInConfigJson)_. 


Set up the client part of the application
---

We asume you are back in the `<oasp_dir>` directory.

Clone the oasp4js repository:

``` 
git clone https://github.com/oasp/oasp4js.git 
```

Install the client part's dependencies: 

```
cd oasp4js
npm install
```

During npm install process bower downloads some libraries and uses git for it. Git defaults to the git protocol whose standard port (9418) is sometimes blocked by the company firewall. A solution for this problem is to configure Git to use the https instead of the git protocol with following command:

``` 
git config --global url."https://".insteadOf git://
```
and to rerun npm install command.


<a name="howToChangeTomcatsPortInConfigJson"></a> 
_**Hint about how to configure a different Tomcat's port to be used on the client side:** If you changed the Tomcat's port as [described here](#changeTomcatsPortInServerXml), then you have to change the default port which is configured in the client part of the application, in the `<oasp_dir>\oasp4js\config.json` file. You have to set the correct port number in the following line of the aforementioned configuration file (replace '8888' with the port number which you configured for your Tomcat):_

```
"proxy": "http://localhost:8888",
```

Start the application using Gulp:

``` 
gulp serve
```

The above Gulp's task opens the client part of the application in your default browser and watches for any changes in HTML/JavaScript/CSS files. Once you change one, the page is reloaded automatically!
 
You can sign in using the following credentials: waiter/waiter or cook/cook.
