import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddProductPageRoutingModule } from './addproduct-routing.module';
import { AddProductPage } from './addproduct.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddProductPageRoutingModule,
  ],
  declarations: [AddProductPage],
})
export class AddProductPageModule {}
