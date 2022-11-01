import { TestBed } from '@angular/core/testing';

import { OCDCommunicationService } from './ocd-communication.service';

describe('ComponentInteractionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OCDCommunicationService = TestBed.get(OCDCommunicationService);
    expect(service).toBeTruthy();
  });
});
