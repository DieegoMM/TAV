import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router'; // Importa el Router
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import imageCompression from 'browser-image-compression';
import { ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute // Agregado
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      state: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      image: [''],
    });
  }
  
  async addProduct() {
    console.log('Método addProduct llamado'); // Añade este log
    if (this.productForm.valid) {
      try {
        await this.productService.addProduct(this.productForm.value);
        alert('Producto agregado exitosamente');
        this.router.navigate(['/profile']);
      } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Hubo un error al agregar el producto');
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
    if (this.productId) {
      this.isEditing = true;
      try {
        const product = await this.productService.getProductById(this.productId);
        if (product) {
          this.productForm.patchValue(product); // Cargar datos en el formulario
          console.log('Producto cargado para edición:', product);
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      }
    }
  }
  

  async saveProduct() {
    if (this.productForm.valid) {
      try {
        if (this.isEditing && this.productId) {
          // Modo de edición
          await this.productService.updateProduct(this.productId, this.productForm.value);
          alert('Producto actualizado exitosamente');
        } else {
          // Modo de creación
          await this.productService.addProduct(this.productForm.value);
          alert('Producto agregado exitosamente');
        }
        this.router.navigate(['/profile']); // Redirige al perfil
      } catch (error) {
        alert('Hubo un error al guardar el producto');
        console.error(error);
      }
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }  
  
}
