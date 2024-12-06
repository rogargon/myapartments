import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { HateoasResourceOperation, ResourceCollection } from "@lagoshny/ngx-hateoas-client";
import { Apartment } from "./apartment";
import { User } from "../login-basic/user";

@Injectable({ providedIn: "root" })
export class ApartmentService extends HateoasResourceOperation<Apartment> {

  constructor() {
    super(Apartment);
  }

  public findByOwner(owner: User): Observable<ResourceCollection<Apartment>> {
    return this.searchCollection("findByOwner", { params: { owner: owner } });
  }

  public findByCity(city: string): Observable<ResourceCollection<Apartment>> {
    return this.searchCollection("findByCity", { params: { city: city } });
  }

  public findByPostalCode(postalCode: string): Observable<ResourceCollection<Apartment>> {
    return this.searchCollection("findByPostalCode", { params: { postalCode: postalCode } });
  }

  public findByCountry(country: string): Observable<ResourceCollection<Apartment>> {
    return this.searchCollection("findByCountry", { params: { country: country } });
  }

  public findByName(name: string): Observable<ResourceCollection<Apartment>> {
    return this.searchCollection("findByName", { params: { name: name } });
  }

  public findByAddress(address: string): Observable<ResourceCollection<Apartment>> {
    return this.searchCollection("findByAddress", { params: { address: address } });
  }

  public isApartmentOwnedByUser(owner: User, userApartment: Apartment): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.findByOwner(owner).subscribe({
        next: (resourceCollection: ResourceCollection<Apartment>) => {
          const apartments = Object.values(resourceCollection).flat();

          const isOwned = apartments.some((apartment: Apartment) =>
            apartment.id === userApartment.id
          );

          observer.next(isOwned);
          observer.complete();
        },
        error: (err) => {
          console.error('Error checking ownership:', err);
          observer.next(false);
          observer.complete();
        },
      });
    });
  }

}
