import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { JewelryBag } from './jewelry-bag';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JewelryService {
  jewelryBags: any[] = [];
  private jewelryBagsUpdated = new Subject<JewelryBag[]>();
  private jewelryBagCollection: AngularFirestoreCollection;

  constructor(
    private http: HttpClient,
    public db: AngularFirestore
  ) {
    this.jewelryBagCollection = db.collection<any>('jewelry-bags');
    this.subscribeToJewelryBags();
  }

  private subscribeToJewelryBags() {
    this.jewelryBagCollection.valueChanges().subscribe((changes) => {
      console.log('HIT SUBSCRIBE !!!!! - changes:', changes);
      this.jewelryBags = changes;
    });
  }

  async addToCollection(newBag: JewelryBag) {
    await this.jewelryBagCollection.add(newBag);
    this.jewelryBagsUpdated.next([...this.jewelryBags]);
  }

  getUpdateListener() {
    return this.jewelryBagsUpdated.asObservable();
  }
}
