import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineComponent } from './online.component';

const routes: Routes = [{ path: '', component: OnlineComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineRoutingModule { }
