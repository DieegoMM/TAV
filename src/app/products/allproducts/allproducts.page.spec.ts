import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllproductsPage } from './allproducts.page';

describe('AllproductsPage', () => {
  let component: AllproductsPage;
  let fixture: ComponentFixture<AllproductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllproductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
