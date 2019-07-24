import { TestBed } from '@angular/core/testing';

import { RequirementsService } from './requirements.service';

describe('RequirementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequirementsService = TestBed.get(RequirementsService);
    expect(service).toBeTruthy();
  });
});
