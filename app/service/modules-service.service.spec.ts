import { TestBed } from '@angular/core/testing';

import { ModulesServiceService } from './modules-service.service';

describe('ModulesServiceService', () => {
  let service: ModulesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModulesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
