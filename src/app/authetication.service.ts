import { Injectable, Injector } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import 'firebase/compat/auth'; // Asegúrate de que esta línea esté incluida

export interface UserData {
  uid?: string; // ID único del usuario (opcional)
  username?: string; // Nombre de usuario
  fullname?: string; // Nombre completo
  age?: number; // Edad
  edad?: number; // Alias para edad
  phone?: string; // Teléfono
  phoneNumber?: string; // Alias para teléfono
  email?: string; // Correo electrónico
  profileImage?: string; // URL o base64 de la imagen de perfil
  region?: string,
  createdAt?: Date; // Fecha de creación
  updatedAt?: Date; // Fecha de actualización
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
  
      // Configura la persistencia de sesión en LOCAL
      this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
        console.error('Error al configurar la persistencia:', error);
      });
    } catch (error) {
      console.error('Error al inicializar AutheticationService:', error);
    }
  }

  getAuthState() {
    return this.afAuth.authState; // Retorna el observable directamente
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

  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut(); // Cierra sesión en Firebase
      console.log('Sesión cerrada correctamente.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  async getProfile(): Promise<any> {
    try {
      const user = await new Promise((resolve, reject) => {
        this.afAuth.onAuthStateChanged((authUser) => {
          if (authUser) {
            resolve(authUser); // Usuario autenticado
          } else {
            reject('No hay usuario autenticado'); // No hay usuario autenticado
          }
        });
      });
  
      if (user) {
        const userDoc = await this.firestore
          .collection('users')
          .doc(user['uid'])
          .get()
          .toPromise();
  
        if (userDoc.exists) {
          const userData = userDoc.data(); // This might be undefined
  
          if (userData && typeof userData === 'object') {
            return { uid: user['uid'], ...userData }; // Spread operator works on objects
          } else {
            throw new Error('El documento del usuario no contiene datos válidos');
          }
        } else {
          throw new Error('El documento del usuario no existe en Firestore');
        }
      }
      return null;
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
      const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
      if (userDoc.exists) {
        const data = userDoc.data() as UserData;
        return { ...data, uid }; // Agrega el UID al objeto retornado
      } else {
        console.warn('No se encontró un documento para el UID:', uid);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      throw error;
    }
  }  

  async updateUserData(
    uid: string,
    fullname: string,
    edad: number,
    phone: string,
    profileImage: string,
    region: string
): Promise<void> {
    try {
        const userRef = this.firestore.collection('users').doc(uid);
        await userRef.update({
            fullname, // Campo fullname
            edad,     // Campo edad
            phone,    // Campo phone
            profileImage, // Campo profileImage
            region: region.trim().toLowerCase(), // Asegúrate de normalizar la región aquí
        });
        console.log('Datos actualizados correctamente en Firestore.');
    } catch (error) {
        console.error('Error al actualizar los datos en Firestore:', error);
        throw error;
    }
}

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Reautenticar al usuario
      await this.reauthenticate(currentPassword);
  
      // Obtener el usuario autenticado
      const user = await this.afAuth.currentUser;
      if (!user) {
        throw new Error('No se encontró un usuario autenticado.');
      }
  
      // Actualizar la contraseña
      await user.updatePassword(newPassword);
      console.log('Contraseña actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      throw error;
    }
  }
  
  

  private async reauthenticate(currentPassword: string): Promise<void> {
    const user = await this.afAuth.currentUser; // Obtén el usuario autenticado
    if (!user || !user.email) {
      throw new Error('No se encontró un usuario autenticado.');
    }
  
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
  
    // Reautenticar al usuario con las credenciales actuales
    await user.reauthenticateWithCredential(credential);
    console.log('Usuario reautenticado correctamente.');
  }

}
