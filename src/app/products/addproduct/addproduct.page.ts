import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
  standalone: false,
})
export class AddProductPage {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router // Inyecta el Router aquí
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      state: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
    });
  }

  async addProduct() {
    if (this.productForm.valid) {
      try {
        await this.productService.addProduct(this.productForm.value);
        alert('Producto agregado exitosamente');
        this.router.navigate(['/profile']); // Ahora debería funcionar
      } catch (error) {
        alert('Hubo un error al agregar el producto');
        console.error(error);
      }
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }
}
