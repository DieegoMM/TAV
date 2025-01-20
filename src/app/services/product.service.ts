import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AutheticationService } from '../authetication.service'; // Ruta de tu servicio de autenticación


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AutheticationService
  ) {}

  // Método para agregar un producto
  async addProduct(productData: any) {
    try {
      const user = await this.authService.getProfile();
      if (!user) {
        throw new Error('No se encontró al usuario autenticado');
      }
  
      const product = {
        ...productData,
        ownerId: user.uid,
        ownerName: user.fullname,
        ownerEmail: user.email,
        ownerPhone: user.phone,
        createdAt: new Date(),
      };
  
      await this.firestore.collection('products').add(product);
      console.log('Producto agregado correctamente.');
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  }

  // Método para obtener productos por usuario
  async getProductsByUser(uid: string): Promise<any[]> {
    try {
      const snapshot = await this.firestore
        .collection('products', (ref) => ref.where('ownerId', '==', uid))
        .get()
        .toPromise();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  async getAllProducts(): Promise<any[]> {
    try {
      const snapshot = await this.firestore.collection('products').get().toPromise();
      return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  }
}
