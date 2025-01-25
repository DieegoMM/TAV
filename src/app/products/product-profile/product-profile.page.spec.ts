import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductProfilePage } from './product-profile.page';

describe('ProductProfilePage', () => {
  let component: ProductProfilePage;
  let fixture: ComponentFixture<ProductProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
