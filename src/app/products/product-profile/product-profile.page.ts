import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-product-profile',
  templateUrl: './product-profile.page.html',
  styleUrls: ['./product-profile.page.scss'],
  standalone: false
})
export class ProductProfilePage implements OnInit {
  isAuthenticated: boolean = false;
  product: any;
  stateMap = {
    sin_uso: 'Sin uso',
    casi_nuevo: 'Casi nuevo',
    muy_poco_uso: 'Muy poco uso',
    poco_uso: 'Poco uso',
    algo_uso: 'Algo de uso',
    mucho_uso: 'Mucho uso',
    mal_estado: 'Mal estado',
    inutilizable: 'Necesita reparación',
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AutheticationService
  ) {}

  async ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('ID recibido desde la URL:', productId);

    if (productId) {
      try {
        this.authService.getAuthState().subscribe(async (user) => {
          this.isAuthenticated = !!user; // Si el usuario está autenticado, será true
      });
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

  // Función para copiar al portapapeles
  copyToClipboard(text: string) {
    if (!navigator.clipboard) {
      console.error('El portapapeles no está soportado en este navegador.');
      alert('Tu navegador no soporta esta función.');
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log(`Texto copiado al portapapeles: ${text}`);
        alert('Copiado al portapapeles.');
      })
      .catch((error) => {
        console.error('Error al copiar al portapapeles:', error);
        alert('Hubo un error al copiar. Intenta nuevamente.');
      });
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
