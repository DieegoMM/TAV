import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutheticationService } from 'src/app/authetication.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  isAuthenticated: boolean = false;
  allProducts: any[] = [];
  filteredProducts: any[] = []; // Ahora estará vacío inicialmente
  searchQuery: string = ''; // Mantener el texto de búsqueda

  constructor(
    private authService: AutheticationService,
    private router: Router,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    try {
      this.allProducts = await this.productService.getAllProducts();
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }

    const user = await this.authService.getProfile();
    this.isAuthenticated = !!user;
  }

  async logout() {
    await this.authService.signOut();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  onSearch(event: Event) {
    // Captura el texto de búsqueda
    this.searchQuery = (event.target as HTMLInputElement).value.toLowerCase();
    console.log('Texto buscado:', this.searchQuery); // Log para depuración
  
    // Si hay texto en la barra de búsqueda, filtra los productos
    if (this.searchQuery.trim() !== '') {
      this.filteredProducts = this.allProducts.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery)
      );
      console.log('Productos filtrados:', this.filteredProducts); // Log para depuración
    } else {
      // Si no hay texto en la búsqueda, vacía la lista de productos
      this.filteredProducts = [];
      console.log('Búsqueda vacía, lista de productos vacía.');
    }
  }  

  // Método para redirigir a la página del producto
  goToProduct(productId: string) {
    this.router.navigate(['/product-profile', productId]);
  }

  
}
