import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockInSaleInfoComponent } from './clock-in-sale-info.component';

describe('ClockInSaleInfoComponent', () => {
  let component: ClockInSaleInfoComponent;
  let fixture: ComponentFixture<ClockInSaleInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockInSaleInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClockInSaleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
