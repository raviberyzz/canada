# Sun Life AEM wcm core project

## Modules

The main parts of the template are:

* core: Java bundle containing all core functionality like OSGi services, listeners or schedulers, as well as component-related Java code such as servlets or request filters.
* ui.apps: contains the /apps (and /etc) parts of the project, ie JS&CSS clientlibs, components, templates, runmode specific configs as well as Hobbes-tests
* ui.content: contains content using the components from the ui.apps
* node-app: contains front end application details i.e., component javascript and CSS code, which will be compiled at build to create clientlibs

## How to build

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean install

If you have a running AEM instance you can build and package the whole project and deploy into AEM with  

    mvn clean install -PautoInstallPackage
    
Or to deploy it to a publish instance, run

    mvn clean install -PautoInstallPackagePublish
    
Or alternatively

    mvn clean install -PautoInstallPackage -Daem.port=4503

Or to deploy only the bundle to the author, run

    mvn clean install -PautoInstallBundle

## How to configure
Create sunlife-app-systemuser system user and provide read permissions to /content folder

## Maven settings

The project comes with the auto-public repository configured. To setup the repository in your Maven settings, refer to:

    http://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html

### Import SSL certificate into maven

While performing build if you see SSL certificate error follow below instructions.
- Access https://repo.adobe.com/ 
- Download the SSL certificate (Use certificate export utility)
- Import the exported SSL certificate in JAVA certs using the below command
    keytool -import -trustcacerts -keystore $JAVA_HOME/jre/lib/security/cacerts -storepass changeit -alias Root -import -file <certificate path>