# Client-Web

This project was generated with [Angular
CLI](https://github.com/angular/angular-cli) version 12.2.10.

## Development server

Run `yarn start` for a dev server. Navigate to `http://localhost:8000/client-citizen`. The app
will automatically reload if you change any of the source files. To view which
files are being served visit: http://localhost:8000/webpack-dev-server

## Running unit tests

Run `yarn test` to execute the unit tests via
[Karma](https://karma-runner.github.io).

## Configurations

There are two different aspects of the app that can be configured:

- App config: patient/clinician-mode, fake-native layer, base URL, etc.
- OIDC config: enabled/disabled, OIDC provider, etc.

each of these can be changed using the `build.sh` script, for example:

```
./build.sh app_config demo
./build.sh oidc_config auth-zero
```

where:

- the argument given to `app_config` corresponds to one of the names in the
  `config/app` folder, which contains the different variations of the
  `app.config.json` file,
- the argument given to `oidc_config` corresponds to one of the names in the
  `config/oidc` folder, which contains the different variations of the
  `oidc.config.json` file.

If a new config file needs to be added, it is simply added to the appropriate
folder.

Finally, there is also a single config inside `src/main.ts`:

    const production = true;

This flag unfortunately can't be set via any of the other methods as `main.ts`
is loaded as the first thing by the application. Explanation of the flag can be
found here: https://angular.io/api/core/enableProdMode

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular
CLI Overview and Command Reference](https://angular.io/cli) page.

## Using Angular CLI (ng) to auto generate:

Creating a module (login.module.ts with routing):

    ng g m components/login --routing

Creating a component (creates login component in the login folder and adds to module):

    ng g c -m login components/login/login

For questionnaire nodes:

    ng g c -m questionnaire-nodes components/questionnaire-nodes/manual/bloodPressureManualDeviceNode

Creating a service (some-service.ts)

    ng g s services/someService

Creating a directive (thread.directive.ts):

    ng g d directives/thread

Creating a pipe (clickable-links.pipe.ts):

    ng g p pipes/clickableLinks
