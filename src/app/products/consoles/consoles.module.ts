import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsolesPageRoutingModule } from './consoles-routing.module';

import { ConsolesPage } from './consoles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsolesPageRoutingModule
  ],
  declarations: [ConsolesPage]
})
export class ConsolesPageModule {}
