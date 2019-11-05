import { TestBed } from '@angular/core/testing';

import { TestConfigService } from './test-config.service';

describe('TestConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestConfigService = TestBed.get(TestConfigService);
    expect(service).toBeTruthy();
  });
});
