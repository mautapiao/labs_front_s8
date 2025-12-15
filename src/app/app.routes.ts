import { Routes } from '@angular/router';
import { publicGuard, privateGuard } from './guards/auth.guard';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { ClinicaComponent } from './components/clinica/clinica.component';
import { LayoutWithNavbarComponent } from './layouts/layout-with-navbar/layout-with-navbar.component';
import { AdminGuard } from './guards/admin.guard';
import { PerfilComponent } from './components/perfil/perfil.component';
import { HomeComponent } from './components/home/home.component';
import { LabsListComponent } from './components/admin/labs/labs-list/labs-list.component';
import { LabsCreateComponent } from './components/admin/labs/labs-create/labs-create.component';
import { LabsEditComponent } from './components/admin/labs/labs-edit/labs-edit.component';
import { TaListComponent } from './components/admin/tipo-analisis/ta-list/ta-list.component';
import { TaCreateComponent } from './components/admin/tipo-analisis/ta-create/ta-create.component';
import { TaEditComponent } from './components/admin/tipo-analisis/ta-edit/ta-edit.component';
import { UsuarioListComponent } from './components/admin/usuarios/usuario-list/usuario-list.component';
import { PacienteListComponent } from './components/admin/pacientes/paciente-list/paciente-list.component';
import { PacienteCreateComponent } from './components/admin/pacientes/paciente-create/paciente-create.component';
import { PacienteEditComponent } from './components/admin/pacientes/paciente-edit/paciente-edit.component';
import { SolicitudListComponent } from './components/analisis/solicitud-list/solicitud-list.component';
import { SolicitudCreateComponent } from './components/analisis/solicitud-create/solicitud-create.component';
import { SolicitudEditComponent } from './components/analisis/solicitud-edit/solicitud-edit.component';

export const routes: Routes = [
  // ======================================
  // RUTAS PÚBLICAS (sin navbar)
  // ======================================
  {
    path: '',
    component: HomeComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: 'recuperar-password',
    component: RecuperarPasswordComponent
  },

  // ======================================
  // RUTAS PRIVADAS (con navbar)
  // ======================================
  {
    path: '',
    component: LayoutWithNavbarComponent,
    canActivate: [privateGuard],
    children: [
      {
        path: 'clinica',
        component: ClinicaComponent
      },
      {
        path: 'solicitudes',
        component: SolicitudListComponent
      },
      { 
        path: 'solicitudes/nuevo',
        component: SolicitudCreateComponent,
        
       },
       { path: 'solicitudes/editar/:id', 
        component: SolicitudEditComponent,// GET por ID visible
      },
       {
        path: 'perfil',
        component: PerfilComponent
      },

       {
        path: 'laboratorios',
        component:LabsListComponent,
        canActivate:[AdminGuard] // solo admin 
      }
      ,{ 
        path: 'laboratorios/nuevo',
        component: LabsCreateComponent,
        canActivate:[AdminGuard] // solo admin 
       },
      { path: 'laboratorios/editar/:id', 
        component: LabsEditComponent,// GET por ID visible
        canActivate:[AdminGuard] // solo admin 
      },
       {
        path: 'tipo-analisis',
        component:TaListComponent,
        canActivate:[AdminGuard] // solo admin 
      },
      { 
        path: 'tipo-analisis/nuevo',
        component: TaCreateComponent,
        canActivate:[AdminGuard] // solo admin 
       },
      { path: 'tipo-analisis/editar/:id', 
        component: TaEditComponent,// GET por ID visible
        canActivate:[AdminGuard] // solo admin 
      },
       {
        path: 'usuarios',
        component:UsuarioListComponent,
        canActivate:[AdminGuard] // solo admin 
      },
       {
        path: 'pacientes',
        component:PacienteListComponent,
        canActivate:[AdminGuard] // solo admin 
      },
      
      { 
        path: 'pacientes/nuevo',
        component: PacienteCreateComponent,
        canActivate:[AdminGuard] // solo admin 
       },
      
      { path: 'pacientes/editar/:id', 
        component: PacienteEditComponent,// GET por ID visible
        canActivate:[AdminGuard] // solo admin 
      },
    ]
  },

  // Ruta 404
  { path: '**', redirectTo: '' }
];

