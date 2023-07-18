import { TestBed } from '@angular/core/testing';

import { LocalStorageResourceService } from './local-storage-resource.service';
import { ResourceService } from './resource.service';
import { Resource } from '../../model/resource';
import { mockLocalStorage } from '../../util/testing';

describe('LocalStorageResourceService', () => {
  let service: ResourceService;

  let createResource: Resource = {
    id: "",
    label: "RTW 123",
    description: "Test",
    statusCode: 2
  };

  beforeEach(() => {
    mockLocalStorage();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ResourceService,
          useClass: LocalStorageResourceService
        }
      ]
    });
    service = TestBed.inject(ResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch no resources when local storage is empty', () => {
    service.getResources().subscribe(resources => {
      expect(resources).toEqual([]);
    });
  });

  it('should create a resource correctly', () => {
    service.createResource(createResource).subscribe(createdResource => {
      expect(createdResource.id).toBe("0");
      expect(createdResource.label).toBe(createResource.label);
      expect(createdResource.description).toBe(createResource.description);
      expect(createdResource.statusCode).toBe(createResource.statusCode);
    });
  });

  it('should fetch resource correctly that was created', () => {
    service.createResource(createResource).subscribe(createdResource => {
      service.getResources().subscribe(resources => {
        expect(resources.length).toBe(1);
        expect(resources[0]).toEqual(createdResource);
      });
    });
  });

  it('should increment id of multiple inserted resources correctly', () => {
    let amount = 10;
    for (let i = 0; i < amount; i++) {
      service.createResource(createResource);
    }
    service.getResources().subscribe(resources => {
      expect(resources.length).toBe(amount);
      for (let i = 0; i < amount; i++) {
        expect(resources[i].id).toBe(i.toString());
      }
    });
  });

  it('should delete a resource correctly', () => {
    service.createResource(createResource).subscribe(resource => {
      service.deleteResource(resource).subscribe(successful => {
        expect(successful).toBeTrue();
        service.getResources().subscribe(resources => {
          console.log(resources);
          expect(resources.length).toBe(0);
        });
      });
    });
  });

  it('should not delete a resource that does not exist', () => {
    service.createResource(createResource).subscribe(resource => {
      resource.id = "123";
      service.deleteResource(resource).subscribe(successful => {
        expect(successful).toBeFalse();
        service.getResources().subscribe(resources => expect(resources.length).toBe(1));
      });
    });
  });

  it('should update a resource correctly', () => {
    service.createResource(createResource).subscribe(resource => {
      resource.description = "Updated description";
      service.updateResource(resource).subscribe(successful => {
        expect(successful).toBeTrue();
        service.getResourceById(resource.id).subscribe(resource => {
          expect(resource).not.toBeUndefined();
          expect(resource?.description).toBe("Updated description");
        });
      });
    });
  });
});
