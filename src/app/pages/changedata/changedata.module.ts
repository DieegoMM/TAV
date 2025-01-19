import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangedataPageRoutingModule } from './changedata-routing.module';

import { ChangedataPage } from './changedata.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ChangedataPageRoutingModule
  ],
  declarations: [ChangedataPage]
})
export class ChangedataPageModule {}
