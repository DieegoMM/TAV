import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
  standalone: false,
})
export class GamesPage implements OnInit {
  games: any[] = []; // Aquí se almacenarán los productos de juegos

  constructor(private productService: ProductService) {}

  stateMap = {
    sin_uso: 'Sin uso',
    algo_uso: 'Algo de uso',
    casi_nuevo: 'Casi nuevo',
    mal_estado: 'Mal estado',
    inutilizable: 'Necesita reparo',
  };
  

  async ngOnInit() {
    try {
      const allProducts = await this.productService.getAllProducts();
      this.games = allProducts.filter((product) => product.type === 'juegos');
    } catch (error) {
      console.error('Error al cargar juegos:', error);
    }
  }

  formatRegion(region: string | undefined): string {
    if (!region) return 'No especificada'; // Si no hay región
    return region
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .replace("O'higgins", "O'Higgins"); // Caso especial para O'Higgins
  }
  
  
}
