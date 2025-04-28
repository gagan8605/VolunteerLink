import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { volunteerGuard } from './volunteer.guard';

describe('volunteerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => volunteerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
