import { Injectable ,signal} from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _searchTerm: string = '';
  searchTerm = signal('');

  setSearchTerm(term: string) {

    this._searchTerm = term;
  }

  getSearchTerm(): string {
    return this._searchTerm;
  }
}
