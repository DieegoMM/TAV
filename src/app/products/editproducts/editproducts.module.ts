import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditproductsPageRoutingModule } from './editproducts-routing.module';

import { EditproductsPage } from './editproducts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditproductsPageRoutingModule
  ],
  declarations: [EditproductsPage]
})
export class EditproductsPageModule {}
