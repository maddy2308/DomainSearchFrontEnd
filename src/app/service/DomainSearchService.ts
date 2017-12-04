import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {HttpClientHelper} from './HttpClientHelper';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

const BASE_URL = HttpClientHelper.baseURL;

@Injectable()
export class DomainSearchService {

  constructor(private http: Http) {
  }

  getMatchingDomain(partialWord) {
    return this.http.get( BASE_URL + '/domain/' + partialWord)
      .map(
        (response: Response) => {
          const data = response.json();
          return data;
        })
      .catch(
        (error: Response) => {
          console.log(error);
          return Observable.throw('Couldn\'t fetch the partial matches');
        }
      );
  }
}
