import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsolesPage } from './consoles.page';

describe('ConsolesPage', () => {
  let component: ConsolesPage;
  let fixture: ComponentFixture<ConsolesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
