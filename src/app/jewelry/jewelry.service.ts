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

  getEarrings() {
    return this.http.get<{message: string, data: JewelryBag[]}>('http://localhost:3000/api/earrings')
      .subscribe((response) => {
        console.log('RESPONSE from SERVER!', response);
        this.jewelryBags = response.data;
        this.jewelryBagsUpdated.next([...this.jewelryBags]);
      });
  }

  getUpdateListener() {
    return this.jewelryBagsUpdated.asObservable();
  }
}
