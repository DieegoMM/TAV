import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-profile',
  templateUrl: './product-profile.page.html',
  styleUrls: ['./product-profile.page.scss'],
  standalone: false
})
export class ProductProfilePage implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('ID recibido desde la URL:', productId);

    if (productId) {
      try {
        this.product = await this.productService.getProductById(productId);
        console.log('Producto cargado:', this.product);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        alert('No se pudo cargar el producto.');
      }
    } else {
      console.warn('No se recibió un ID válido.');
    }
  }
}
