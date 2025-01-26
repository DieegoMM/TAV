import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router'; // Importa el Router
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import imageCompression from 'browser-image-compression';
import { ActivatedRoute } from '@angular/router';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
  standalone: false,
})
export class AddProductPage {
  productForm: FormGroup;
  isEditing = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AutheticationService // Agrega esta línea
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      state: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      image: [''],
      region: [''], 
    });
  }
  
  async addProduct() {
    console.log('Método addProduct llamado');
    if (this.productForm.valid) {
      try {
        const user = await this.authService.getProfile();
        if (!user?.region) {
          alert('No se pudo determinar la región del usuario.');
          return;
        }
  
        // Agregar región del usuario al producto
        const productData = {
          ...this.productForm.value,
          region: user.region, // Región obtenida del perfil del usuario
          createdAt: new Date(),
        };
  
        await this.productService.addProduct(productData); // Guardar producto en Firebase
        alert('Producto agregado exitosamente');
        this.router.navigate(['/profile']); // Redirige al perfil
      } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Hubo un error al agregar el producto.');
      }
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }
  
  async selectImage() {
    try {
      // Abrir cámara o galería
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Base64
        source: CameraSource.Prompt, // Permite elegir entre cámara o galería
      });
  
      if (image.dataUrl) {
        // Convertir el DataURL a un archivo
        const imageFile = this.dataURLtoFile(image.dataUrl, 'productImage.jpg');
      
        // Comprimir el archivo de imagen
        const compressedImage = await imageCompression(imageFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
        });
      
        // Convertir el archivo comprimido de nuevo a DataURL si es necesario
        const compressedImageDataUrl = await this.fileToDataURL(compressedImage);
      
        // Guardar la imagen comprimida en el formulario
        this.productForm.patchValue({ image: compressedImageDataUrl });
      
        console.log('Imagen comprimida seleccionada:', compressedImageDataUrl);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      alert('No se pudo acceder a la cámara o galería.');
    }
  }
  
  // Helper para convertir Base64 a archivo
  dataURLtoFile(dataUrl: string, fileName: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('ID del producto para edición:', this.productId);
    
    if (this.productId) {
      this.isEditing = true;
      console.log('Modo edición activado');
    
      try {
        const product = await this.productService.getProductById(this.productId);
        if (product) {
          console.log('Producto cargado para edición:', product);
          this.productForm.patchValue(product); // Cargar datos en el formulario
        } else {
          console.warn('No se encontró ningún producto con el ID proporcionado.');
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      }
    } else {
      console.log('Modo creación activado. No hay ID de producto.');
    }
  }  

  async saveProduct() {
    console.log('Método saveProduct llamado');
    if (this.productForm.valid) {
      try {
        // Obtén la región del usuario actual
        const region = await this.getRegionFromUser();
  
        // Crea el objeto del producto incluyendo la región
        const productData = {
          ...this.productForm.value,
          region: region || this.productForm.value.region, // Prioriza la región del usuario
        };
  
        if (this.isEditing && this.productId) {
          console.log('Actualizando producto con ID:', this.productId);
          await this.productService.updateProduct(this.productId, productData);
          console.log('Producto actualizado correctamente.');
        } else {
          console.log('Agregando nuevo producto:', productData);
          await this.productService.addProduct(productData);
          console.log('Producto agregado correctamente.');
        }
  
        alert('Producto guardado correctamente.');
        
        // Redirige al perfil después de guardar el producto
        this.router.navigate(['/profile']);
        
      } catch (error) {
        console.error('Error en saveProduct:', error);
        alert('Hubo un error al guardar el producto.');
      }
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  async getRegionFromUser(): Promise<string> {
    try {
      const user = await this.authService.getProfile(); // Obtén el perfil del usuario autenticado
      return user?.region || ''; // Devuelve la región o un valor vacío si no existe
    } catch (error) {
      console.error('Error al obtener la región del usuario:', error);
      return ''; // Devuelve un valor por defecto en caso de error
    }
  }
  
}
