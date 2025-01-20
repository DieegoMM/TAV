import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditproductsPage } from './editproducts.page';

describe('EditproductsPage', () => {
  let component: EditproductsPage;
  let fixture: ComponentFixture<EditproductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditproductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
