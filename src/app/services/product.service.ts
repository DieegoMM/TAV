import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AutheticationService } from '../authetication.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AutheticationService,  
    
  ) {}

  generateProductId(): string {
    return this.firestore.createId();
  }

  async addProduct(productData: any): Promise<void> {
    try {
      const user = await this.authService.getProfile();
      if (!user) {
        throw new Error('No se encontró al usuario autenticado');
      }
  
      // Validar que la región del usuario exista
      if (!user.region || user.region.trim() === '') {
        throw new Error('El usuario no tiene configurada una región.');
      }
  
      // Genera un nuevo ID para el producto
      const productId = this.firestore.createId();
  
      // Incluye la región del usuario en los datos del producto
      const product = {
        ...productData,
        id: productId, // Incluye el ID generado
        ownerId: user.uid,
        ownerName: user.fullname,
        ownerEmail: user.email,
        ownerPhone: user.phone,
        region: user.region.trim().toLowerCase(), // Normaliza la región
        createdAt: new Date(),
      };
  
      // Guarda el producto usando el ID generado
      await this.firestore.collection('products').doc(productId).set(product);
      console.log('Producto agregado correctamente en Firebase.');
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  }
    
  async getProductsByUser(userId: string): Promise<any[]> {
    console.log('getProductsByUser: Recibiendo userId:', userId);
    return this.firestore
      .collection('products', (ref) => ref.where('ownerId', '==', userId))
      .get()
      .toPromise()
      .then((snapshot) => {
        const products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        console.log('Productos cargados desde Firestore:', products);
        return products;
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        return []; // Retorna un arreglo vacío en caso de error
      });
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
      const productDoc = await this.firestore
        .collection('products')
        .doc(productId)
        .get()
        .toPromise();
  
      if (productDoc.exists) {
        return { id: productDoc.id, ...(productDoc.data() as any) };
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      throw error;
    }
  }
  

  async deleteProduct(productId: string): Promise<void> {
    try {
      console.log('Eliminando producto con ID:', productId);
      await this.firestore.collection('products').doc(productId).delete();
      console.log('Producto eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw error;
    }
  }

  async getProductsByType(type: string): Promise<any[]> {
    try {
      const snapshot = await this.firestore
        .collection('products', (ref) => ref.where('type', '==', type))
        .get()
        .toPromise();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
    } catch (error) {
      console.error('Error al obtener productos por tipo:', error);
      throw error;
    }
  }
  
  async updateProductsRegion(ownerId: string, newRegion: string): Promise<void> {
    try {
        const productsSnapshot = await this.firestore
            .collection('products', (ref) => ref.where('ownerId', '==', ownerId))
            .get()
            .toPromise();

        const batch = this.firestore.firestore.batch();

        productsSnapshot.forEach((doc) => {
            const productRef = this.firestore.collection('products').doc(doc.id).ref;
            batch.update(productRef, { region: newRegion });
        });

        await batch.commit();
        console.log('Productos actualizados correctamente con la nueva región.');
    } catch (error) {
        console.error('Error al actualizar la región de los productos:', error);
        throw error;
    }
}

}
