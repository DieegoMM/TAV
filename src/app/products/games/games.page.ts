import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
  standalone: false,
})
export class GamesPage implements OnInit {
  games: any[] = []; // Aquí se almacenarán los productos de juegos
  isAuthenticated: boolean = false;

  constructor(private productService: ProductService, private authService: AutheticationService) {}

  stateMap = {
    sin_uso: 'Sin uso',
    algo_uso: 'Algo de uso',
    casi_nuevo: 'Casi nuevo',
    mal_estado: 'Mal estado',
    inutilizable: 'Necesita reparo',
  };
  

  async ngOnInit() {
    try {
      // Fetch all products from the service
      const allProducts = await this.productService.getAllProducts();
  
      // Filter products whose type is "juegos"
      this.games = allProducts.filter((product) => product.type === 'juegos');
  
      // Debugging the filtered games
      console.log('Productos tipo "juegos":', this.games);

      this.authService.getAuthState().subscribe((user) => {
        this.isAuthenticated = !!user; // True si hay usuario autenticado
      });
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

  logout() {
    this.authService.signOut();
  }
  
}
