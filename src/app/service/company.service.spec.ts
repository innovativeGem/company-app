import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { CompanyService } from './company.service';

describe('CompanyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyService],
      imports: [HttpModule]
    });
  });

  it('should be created', inject([CompanyService], (service: CompanyService) => {
    expect(service).toBeTruthy();
  }));
});
