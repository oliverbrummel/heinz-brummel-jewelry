import { TestBed } from '@angular/core/testing';

import { JewelryService } from './jewelry.service';

describe('JewelryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JewelryService = TestBed.get(JewelryService);
    expect(service).toBeTruthy();
  });
});
