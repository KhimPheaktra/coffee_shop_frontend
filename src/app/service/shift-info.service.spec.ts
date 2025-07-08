import { TestBed } from '@angular/core/testing';

import { ShiftInfoService } from './shift-info.service';

describe('ShiftInfoService', () => {
  let service: ShiftInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
