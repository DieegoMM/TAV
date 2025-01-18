import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControllersPage } from './controllers.page';

describe('ControllersPage', () => {
  let component: ControllersPage;
  let fixture: ComponentFixture<ControllersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
