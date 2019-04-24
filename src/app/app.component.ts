import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JewelryService } from './jewelry/jewelry.service';
import { JewelryBag } from './jewelry/jewelry-bag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private jewelryService: JewelryService) {}
  private jewelryBagsSub: Subscription;
  title = 'heinz-brummel-jewelry';

  ngOnInit() {
    this.jewelryBagsSub = this.jewelryService.getUpdateListener()
      .subscribe((updatedBags: JewelryBag[]) => {
        console.log('LIST OF BAGS', updatedBags);
      });
  }

  addJewelryBag() {
    const mockBag: JewelryBag = {
      desc: 'testing',
      name: 'wawaweewa',
      price: '$100',
      image: '.....',
      type: 'earring'
    };
    this.jewelryService.addToCollection(mockBag);
    // this.jewelryService.addJewelryBag(mockBag);
  }

  ngOnDestroy() {
    this.jewelryBagsSub.unsubscribe();
  }
}
