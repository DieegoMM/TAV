import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AutheticationService {
  constructor(
    public ngFireAuth: AngularFireAuth,
    private firestore: AngularFirestore // Para usar Firestore
  ) {}

  // Registrar usuario en Firebase Authentication
  async registerUser(email: string, password: string) {
    return await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  // Iniciar sesión con email y contraseña
  async loginUser(email: string, password: string) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  // Restablecer contraseña
  async resetPassword(email: string) {
    return await this.ngFireAuth.sendPasswordResetEmail(email);
  }

  // Cerrar sesión
  async signOut() {
    return await this.ngFireAuth.signOut();
  }

  // Obtener el perfil del usuario actual
  async getProfile() {
    return await this.ngFireAuth.currentUser;
  }

  // Guardar datos adicionales del usuario en Firestore
  async saveUserData(uid: string, username: string, age: number, email: string) {
    try {
      const userRef = this.firestore.collection('users').doc(uid); // Referencia al documento
      await userRef.set({
        username: username,
        age: age,
        email: email,
        createdAt: new Date(),
      });
      console.log('Datos guardados correctamente en Firestore.');
    } catch (error) {
      console.error('Error al guardar los datos en Firestore:', error);
    }
  }
}
