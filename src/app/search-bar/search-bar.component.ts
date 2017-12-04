import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';

import {DomainSearchService} from '../service/DomainSearchService';
import {WindowRef} from '../service/WindowRef';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  providers: [WindowRef]
})
export class SearchBarComponent implements OnInit {

  model: string;
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  result: string[];
  nativeWindow: any;

  constructor(private domainSearchService: DomainSearchService, private winRef: WindowRef) {}

  ngOnInit() {
    this.result = [];
    this.nativeWindow = this.winRef.getNativeWindow();
  }

  selectedItem(ev) {
    this.nativeWindow.open('http://' + ev.item);
  }


  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term => term.length <= 3 ? [] :
        this.domainSearchService.getMatchingDomain(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed)


  partialMatches() {
    this.domainSearchService.getMatchingDomain(this.model)
      .subscribe(
        (resp) => this.result = resp,
        (error) => console.log(error)
      );
  }
}
