import { Injectable, Injector } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { lastValueFrom } from 'rxjs';

export interface UserData {
  username: string; // Nombre de usuario
  age: number;      // Edad del usuario
  email: string;    // Correo electrónico del usuario
  createdAt?: Date; // Fecha opcional de creación
  updatedAt?: Date; // Fecha opcional de actualización
}

@Injectable({
  providedIn: 'root',
})
export class AutheticationService {
  private afAuth: AngularFireAuth;
  private firestore: AngularFirestore;

  constructor(private injector: Injector) {
    try {
      // Inyecta manualmente AngularFireAuth y AngularFirestore
      this.afAuth = this.injector.get(AngularFireAuth);
      this.firestore = this.injector.get(AngularFirestore);

      // Configura persistencia de sesión
      this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
        console.error('Error al configurar la persistencia:', error);
      });
    } 
    catch (error) {
      console.error('Error al inicializar AutheticationService:', error);
    }
  }

  getAuthState() {
    return this.afAuth.authState;
  }

  // Métodos de autenticación
  async registerUser(email: string, password: string) {
    return await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async loginUser(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async resetPassword(email: string) {
    return await this.afAuth.sendPasswordResetEmail(email);
  }

  async signOut() {
    return await this.afAuth.signOut();
  }

  async getProfile() {
    try {
      const user = await this.afAuth.currentUser; // Obtén el usuario autenticado
      if (user) {
        console.log('Usuario autenticado en getProfile:', user);
        return user; // Retorna el usuario si está autenticado
      } else {
        console.warn('No hay un usuario autenticado.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      throw error;
    }
  }

  async saveUserData(uid: string, username: string, age: number, email: string) {
    try {
      const userRef = this.firestore.collection('users').doc(uid);
      await userRef.set({
        username,
        age,
        email,
        createdAt: new Date(),
      });
      console.log('Datos guardados en Firestore.');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  }

  async getUserData(uid: string): Promise<UserData | null> {
    try {
      console.log('Obteniendo datos para el UID:', uid);
  
      // Utiliza lastValueFrom para convertir el observable a una promesa
      const userDoc = await lastValueFrom(this.firestore.collection('users').doc(uid).get());
  
      if (userDoc.exists) {
        console.log('Documento encontrado:', userDoc.data());
        return userDoc.data() as UserData; // Asegura que los datos son de tipo UserData
      } else {
        console.warn('No se encontró un documento para el UID:', uid);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      throw error;
    }
  }

  async updateUserData(uid: string, fullname: string, edad: number) {
    try {
      const userRef = this.firestore.collection('users').doc(uid); // Referencia al documento
      await userRef.update({
        fullname: fullname, // Actualiza el campo fullname
        edad: edad,         // Actualiza el campo edad
      });
      console.log('Datos actualizados correctamente en Firestore.');
    } catch (error) {
      console.error('Error al actualizar los datos en Firestore:', error);
      throw error;
    }
  }
}
