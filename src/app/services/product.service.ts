import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AutheticationService } from '../authetication.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AutheticationService
  ) {}

  async addProduct(productData: any): Promise<void> {
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
      return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  }

  async updateProduct(productId: string, productData: any): Promise<void> {
    try {
      await this.firestore.collection('products').doc(productId).update(productData);
      console.log('Producto actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
    }
  }
  

  async getProductById(productId: string): Promise<any> {
    try {
      const productDoc = await this.firestore.collection('products').doc(productId).get().toPromise();
      if (productDoc.exists) {
        return { id: productDoc.id, ...(productDoc.data() as any)}; // Incluye el ID del documento
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      throw error;
    }
  }
}
