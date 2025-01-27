import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-consoles',
  templateUrl: './consoles.page.html',
  styleUrls: ['./consoles.page.scss'],
  standalone: false,
})
export class ConsolesPage implements OnInit {
  consoles: any[] = []; // Aquí se almacenarán las consolas
  isAuthenticated: boolean = false;

  constructor(
    private productService: ProductService,
    private authService: AutheticationService // Inyección del servicio de autenticación
  ) {}

  stateMap = {
    sin_uso: 'Sin uso',
    algo_uso: 'Algo de uso',
    casi_nuevo: 'Casi nuevo',
    mal_estado: 'Mal estado',
    inutilizable: 'Necesita reparo',
  };

  async ngOnInit() {
    try {
      // Obteniendo las consolas por tipo
      this.consoles = await this.productService.getProductsByType('consolas');

      // Obteniendo el estado de autenticación
      this.authService.getAuthState().subscribe((user) => {
        this.isAuthenticated = !!user; // true si el usuario está autenticado, false si no
      });
    } catch (error) {
      console.error('Error al cargar consolas:', error);
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
    this.authService.signOut(); // Llama al método para cerrar sesión
  }
}
