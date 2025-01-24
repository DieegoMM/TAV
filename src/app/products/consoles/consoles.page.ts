import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-consoles',
  templateUrl: './consoles.page.html',
  styleUrls: ['./consoles.page.scss'],
  standalone: false,
})
export class ConsolesPage implements OnInit {
  consoles: any[] = []; // Aquí se almacenarán las consolas

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
      this.consoles = await this.productService.getProductsByType('consolas');
    } catch (error) {
      console.error('Error al cargar consolas:', error);
    }
  }
}
