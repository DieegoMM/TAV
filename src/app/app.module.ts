import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase Imports (modo compatibilidad)
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';  // ✅ Importación agregada


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    // Configuración de Firebase con las Features
    AngularFireModule.initializeApp(environment.firebaseConfig), //Esto llamará a la clase "firebaseConfig" de enviroment.ts
    AngularFirestoreModule,  // Firestore
    AngularFireAuthModule,   // Autenticación
    AngularFireStorageModule, // Storage (para hosting si usas almacenamiento)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
