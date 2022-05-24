
import { TestBed } from '@angular/core/testing';

import { JWTService } from './jwt_check.service';

describe('JWTService', () => {
  let service: JWTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JWTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
