import { TestBed } from '@angular/core/testing';

import { AlertToastService } from './alert-toast.service';

describe('AlertToastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertToastService = TestBed.get(AlertToastService);
    expect(service).toBeTruthy();
  });
});
