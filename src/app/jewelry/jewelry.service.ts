import { Injectable } from '@angular/core';

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
  private docIdSource = new Subject<string>();
  private jewelryBagCollection: AngularFirestoreCollection;

  docId$ = this.docIdSource.asObservable();

  constructor(
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
    const docId = String(new Date().getTime());
    this.docIdSource.next(docId);
    await this.jewelryBagCollection.doc(docId).set(newBag);
    this.jewelryBagsUpdated.next([...this.jewelryBags]);
  }

  getUpdateListener() {
    return this.jewelryBagsUpdated.asObservable();
  }
}
