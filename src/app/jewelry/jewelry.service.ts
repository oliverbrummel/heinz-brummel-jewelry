import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { JewelryBag } from './jewelry-bag';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JewelryService {
  constructor(private http: HttpClient) { }
  private jewelryBags: JewelryBag[] = [];
  private jewelryBagsUpdated = new Subject<JewelryBag[]>();

  getJewelryBags() {
    return this.http.get<{message: string, data: JewelryBag[]}>('http://localhost:3000/api/earrings')
      .subscribe((response) => {
        console.log('RESPONSE from SERVER!', response);
        this.jewelryBags = response.data;
        this.jewelryBagsUpdated.next([...this.jewelryBags]);
      });
  }

  addJewelryBag(newBag: JewelryBag) {
    this.http.post<{message: string}>('http://localhost:3000/api/earrings', newBag)
      .subscribe((response) => {
        console.log(response.message);
        this.jewelryBags.push(newBag);
        this.jewelryBagsUpdated.next([...this.jewelryBags]);
      });
  }

  getUpdateListener() {
    return this.jewelryBagsUpdated.asObservable();
  }
}
