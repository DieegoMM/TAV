import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangedataPage } from './changedata.page';

describe('ChangedataPage', () => {
  let component: ChangedataPage;
  let fixture: ComponentFixture<ChangedataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
