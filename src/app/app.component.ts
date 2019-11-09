import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { JewelryService } from './jewelry/jewelry.service';
import { JewelryBag } from './jewelry/jewelry-bag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private jewelryService: JewelryService,
    ) {}

  private jewelryBagsSub: Subscription;
  title = 'heinz-brummel-jewelry';
  bag = new JewelryBag();
  bags: JewelryBag[];

  ngOnInit() {
    this.jewelryBagsSub = this.jewelryService.getUpdateListener()
      .subscribe((updatedBags: JewelryBag[]) => {
        this.bags = updatedBags;
        console.log('App Init - this.bags', this.bags);
      });
  }

  addJewelryBag() {
    this.bag.type = 'earring';
    const newData = JSON.parse(JSON.stringify(this.bag));
    this.jewelryService.addToCollection(newData);
  }

  ngOnDestroy() {
    this.jewelryBagsSub.unsubscribe();
  }
}
