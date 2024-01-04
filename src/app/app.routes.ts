import { Routes } from '@angular/router';
import { MembersComponent } from './members/members.component';
import { RegisterComponent } from './register/register.component';
import { UpdateComponent } from './update/update.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'update', component: UpdateComponent },
  { path: 'members', component: MembersComponent }
];
