import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllproductsPage } from './allproducts.page';

const routes: Routes = [
  {
    path: '',
    component: AllproductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllproductsPageRoutingModule {}
