import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsolesPage } from './consoles.page';

const routes: Routes = [
  {
    path: '',
    component: ConsolesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsolesPageRoutingModule {}
