![Screenshot](docs/App_InitialScreen.PNG)

# EnterpriseDesigner - front end

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.1.

## Prerequisites
NodeJS:
- Angular requires either version 8.x or 10.x
- check the version with `node -v`
- [download](https://nodejs.org/en/)

Git:
- Git is necessery to download some dependencies
- [download](https://git-scm.com/downloads)

### Get dependencies
Execute `npm install` to install all dependencies so that you can use a development server to test the application.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Test
Run `npm test` to run all unit tests.
Run `npm run testWithCoverage` to run all unit tests with coverage report.

## Sonar
Run tests with coverage report first to see its result in the sonar as well.
Run `RunSonarAnalysis.bat` to analyse the project.
Run `RunSonarServer.bat` to start the server on `http://localhost:9000/`.

## Generate new Angular components
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
To get functional specification go check file Functional_specification.md.

### package.json
**dependencies** - required to run

**devDependencies** - required to develope

# EnterpriseDesigner - back end

## Prerequisites
You need `.NET SDK`.

## Build and Run
### Option 1
navigate to `\back-end\VSContract.backend\` folder
run command `dotnet build` to compile application
run command `dotnet run` to compile and run application

### Option 2
download and use C# extension for VS Code.