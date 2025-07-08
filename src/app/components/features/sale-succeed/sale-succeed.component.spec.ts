import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSucceedComponent } from './sale-succeed.component';

describe('SaleSucceedComponent', () => {
  let component: SaleSucceedComponent;
  let fixture: ComponentFixture<SaleSucceedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleSucceedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleSucceedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
