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
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana de Santiago',
    'Bernardo O’Higgins',
    'Maule',
    'Ñuble',
    'Biobío',
    'Araucanía',
    'Ríos',
    'Lagos',
    'Aysén',
    'Magallanes',
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
    if (!this.searchQuery.trim() && !this.selectedRegion) {
      // Si no hay búsqueda ni región seleccionada, limpiar productos
      this.filteredProducts = [];
      return;
    }
  
    this.filteredProducts = this.allProducts.filter((product) => {
      const matchesQuery =
        !this.searchQuery || product.name.toLowerCase().includes(this.searchQuery.trim().toLowerCase());
      const matchesRegion =
        !this.selectedRegion ||
        (product.region &&
          product.region.trim().toLowerCase() === this.selectedRegion.replace('región de ', '').trim().toLowerCase());
  
      return matchesQuery && matchesRegion;
    });
  
    console.log('Filtered Products:', this.filteredProducts);
  }  
  
}
