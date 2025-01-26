import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
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
  filteredProducts: any[] = [];
  searchQuery: string = '';
  selectedRegion: string = '';

  regions: string[] = [
    'Región de Arica y Parinacota',
    'Región de Tarapacá',
    'Región de Antofagasta',
    'Región de Atacama',
    'Región de Coquimbo',
    'Región de Valparaíso',
    'Región Metropolitana de Santiago',
    'Región del Libertador General Bernardo O’Higgins',
    'Región del Maule',
    'Región de Ñuble',
    'Región del Biobío',
    'Región de La Araucanía',
    'Región de Los Ríos',
    'Región de Los Lagos',
    'Región de Aysén del General Carlos Ibáñez del Campo',
    'Región de Magallanes y de la Antártica Chilena',
  ];

  @ViewChild('regionSelect', { static: false }) regionSelect: IonSelect;

  constructor(
    private authService: AutheticationService,
    private router: Router,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    try {
      this.allProducts = await this.productService.getAllProducts();
      console.log('Productos cargados:', this.allProducts); // Verifica los datos cargados
      this.filteredProducts = [];
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  
    const user = await this.authService.getProfile();
    this.isAuthenticated = !!user;
  
    // Aplicar filtros iniciales
    this.applyFilters();
  }

  async logout() {
    await this.authService.signOut();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }


  openRegionFilter() {
    this.regionSelect.open();
  }

  filterByRegion() {
    this.applyFilters();
  }

  applyFilters() {
    console.log('Aplicando filtros...');
    console.log('Texto de búsqueda:', this.searchQuery);
    console.log('Región seleccionada:', this.selectedRegion);
  
    if (!this.searchQuery.trim() && !this.selectedRegion) {
      this.filteredProducts = [];
      console.log('Sin filtros aplicados, lista vacía.');
      return;
    }
  
    this.filteredProducts = this.allProducts.filter((product) => {
      const matchesQuery = !this.searchQuery || product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesRegion = !this.selectedRegion || product.region.toLowerCase() === this.selectedRegion.toLowerCase();
      return matchesQuery && matchesRegion;
    });
  
    console.log('Productos filtrados:', this.filteredProducts);
  }
  
  goToProduct(productId: string) {
    this.router.navigate(['/product-profile', productId]);
  }
}
