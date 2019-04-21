import { Component, OnInit, OnDestroy } from '@angular/core';
import { JewelryService } from './jewelry/jewelry.service';
import { Subscription } from 'rxjs';
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
    this.jewelryService.getJewelryBags();
    this.jewelryBagsSub = this.jewelryService.getUpdateListener()
      .subscribe((updatedBags: JewelryBag[]) => {
        console.log('LIST OF BAGS', updatedBags);
      });
  }

  addJewelryBag() {
    const mockBag: JewelryBag = {
      id: '3',
      desc: 'testing',
      name: 'wawaweewa',
      price: '$100',
      photo: '',
      type: 'earring'
    };
    this.jewelryService.addJewelryBag(mockBag);
  }

  ngOnDestroy() {
    this.jewelryBagsSub.unsubscribe();
  }
}
