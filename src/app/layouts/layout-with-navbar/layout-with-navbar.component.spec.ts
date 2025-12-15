import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LayoutWithNavbarComponent } from './layout-with-navbar.component';

describe('LayoutWithNavbarComponent', () => {
  let component: LayoutWithNavbarComponent;
  let fixture: ComponentFixture<LayoutWithNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutWithNavbarComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutWithNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
