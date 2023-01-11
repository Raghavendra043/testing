import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatePassingService as AuthGuard } from './services/state-services/state-passing.service';
import { OidcUtilsService as OidcGuard } from './services/oidc-services/oidc-utils.service';
import { ClinicianService as ClinicianGuard } from './services/rest-api-services/clinician.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./components/login/login-handler.module').then(
        // Will handle oidc login
        (m) => m.LoginHandlerModule
      ),
  },

  {
    path: 'logout',
    loadChildren: () =>
      import('./components/logout/logout-handler.module').then(
        // Will handle oidc logout
        (m) => m.LogoutHandlerModule
      ),
  },

  {
    path: 'reset_login',
    loadChildren: () =>
      import('./components/logout/reset-login-handler.module').then(
        // Will handle oidc reset login
        (m) => m.ResetLoginHandlerModule
      ),
  },

  //----------------------------------------------------------------------------
  //------------------------Clinician app---------------------------------------
  //----------------------------------------------------------------------------

  {
    path: 'create_patient',
    canActivate: [AuthGuard, ClinicianGuard],
    loadChildren: () =>
      import('./components/create-patient/create-patient.module').then(
        (m) => m.CreatePatientModule
      ),
  },

  {
    path: 'clinician_menu',
    canActivate: [AuthGuard, ClinicianGuard],
    loadChildren: () =>
      import('./components/clinician-menu/clinician-menu.module').then(
        (m) => m.ClinicianMenuModule
      ),
  },

  //----------------------------------------------------------------------------
  //-----------------------------OIDC-------------------------------------------
  //----------------------------------------------------------------------------

  {
    path: 'oidc/success',
    canActivate: [OidcGuard],
    loadChildren: () =>
      import(
        './components/oidc/oidc-login-success/oidc-login-success.module'
      ).then((m) => m.OidcLoginSuccessModule),
  },

  {
    path: 'oidc/invalidate_sso',
    canActivate: [OidcGuard],
    loadChildren: () =>
      import(
        './components/oidc/oidc-invalidate-sso-session/oidc-invalidate-sso-session.module'
      ).then((m) => m.OidcInvalidateSsoSessionModule),
  },

  {
    path: 'pincode',
    canActivate: [OidcGuard],
    loadChildren: () =>
      import('./components/oidc/set-pin-code/set-pin-code.module').then(
        (m) => m.SetPinCodeModule
      ),
  },

  {
    path: 'pincode_login',
    canActivate: [OidcGuard],
    loadChildren: () =>
      import('./components/oidc/pin-code-login/pin-code-login.module').then(
        (m) => m.PinCodeLoginModule
      ),
  },

  //----------------------------------------------------------------------------

  {
    path: 'error',
    loadChildren: () =>
      import('./components/errors/errors.module').then((m) => m.ErrorsModule),
  },

  {
    path: 'acknowledgements',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/acknowledgements/acknowledgements.module').then(
        (m) => m.AcknowledgementsModule
      ),
  },

  {
    path: 'menu',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/menu/menu.module').then((m) => m.MenuModule),
  },

  {
    path: 'messages',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/messages/messages.module').then(
        (m) => m.MessagesModule
      ),
  },

  {
    path: 'links_categories',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/category-links/category-links.module').then(
        (m) => m.CategoryLinksModule
      ),
  },

  {
    path: 'calendar',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/calendar/calendar.module').then(
        (m) => m.CalendarModule
      ),
  },

  {
    path: 'questionnaire_results',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './components/questionnaire-results/questionnaire-results.module'
      ).then((m) => m.QuestionnaireResultsModule),
  },

  {
    path: 'my_measurements',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/my-measurements/my-measurements.module').then(
        (m) => m.MyMeasurementsModule
      ),
  },

  {
    path: 'change_password',
    loadChildren: () =>
      import('./components/change-password/change-password.module').then(
        (m) => m.ChangePasswordModule
      ),
  },

  {
    path: 'questionnaires',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/questionnaires/questionnaires.module').then(
        (m) => m.QuestionnairesModule
      ),
  },

  {
    path: 'joinConference',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/conference/conference.module').then(
        (m) => m.ConferenceModule
      ),
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
  providers: [OidcGuard],
})
export class AppRoutingModule {}
