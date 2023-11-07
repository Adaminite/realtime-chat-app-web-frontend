import { TestBed } from '@angular/core/testing';

import { StateManagementService } from './statemanagement.service';

describe('StatemanagementserviceService', () => {
  let service: StateManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
