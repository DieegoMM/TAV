import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProductProfilePageRoutingModule } from './product-profile-routing.module'; // Módulo de rutas
import { ProductProfilePage } from './product-profile.page'; // Componente de la página

@NgModule({
  imports: [
    CommonModule, // Funcionalidades comunes de Angular
    FormsModule, // Soporte para formularios en Angular
    IonicModule, // Funcionalidades de Ionic
    ProductProfilePageRoutingModule, // Configuración de rutas específicas de esta página
  ],
  declarations: [ProductProfilePage], // Declaración del componente ProductProfilePage
})
export class ProductProfilePageModule {}
