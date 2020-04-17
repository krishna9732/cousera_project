import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { of, Observable } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {baseURL} from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient ,
    private ProcessHTTPMsgService: ProcessHTTPMsgService ) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'promotions').pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions/' + id).pipe(catchError(this.ProcessHTTPMsgService.handleError));

  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion[]>(baseURL + 'Promotions?featured=true').pipe(map(Promotions => Promotions[0])).pipe(catchError(this.ProcessHTTPMsgService.handleError));
 }
}
