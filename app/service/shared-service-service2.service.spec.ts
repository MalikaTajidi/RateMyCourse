import { TestBed } from '@angular/core/testing';

import { SharedServiceService2Service } from './shared-service-service2.service';

describe('SharedServiceService2Service', () => {
  let service: SharedServiceService2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedServiceService2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
