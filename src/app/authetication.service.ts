import { Injectable, Injector } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { lastValueFrom } from 'rxjs';

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

  async getUserData(uid: string) {
    try {
      const userDoc = await lastValueFrom(this.firestore.collection('users').doc(uid).get());
      if (userDoc.exists) {
        console.log('Documento encontrado:', userDoc.data());
        return userDoc.data();
      } else {
        console.warn('No se encontró un documento para el UID:', uid);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw error;
    }
  }
}
