import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {
menu: any = [
  {
    "menu_id": 1,
    "image": "assets/icon/usuario.png",
    "title": "Mis Datos",
  },
  {
    "menu_id": 2,
    "image": "assets/icon/clave.png",
    "title": "Cambiar Contraseña",
  },
  {
    "menu_id": 3,
    "image": "assets/icon/telefono.png",
    "title": "Cambiar Teléfono",
  },
  {
    "menu_id": 4,
    "image": "assets/icon/direccion.png",
    "title": "Cambiar Dirección",
  },
  {
    "menu_id": 5,
    "image": "assets/icon/cerrar.png",
    "title": "Cerrar Sesión",
  }
]
  constructor() { }

  ngOnInit() {
  }

}
