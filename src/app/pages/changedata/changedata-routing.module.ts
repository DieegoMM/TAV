import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangedataPage } from './changedata.page';

const routes: Routes = [
  {
    path: '',
    component: ChangedataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangedataPageRoutingModule {}
