import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CompanyService {

  constructor(private http: Http) { }

  staff: Observable<any[]>;

  getData() {
    return this.http.get(`../../assets/data.json`)
    .map((res: Response) => res.json());
  }

}
