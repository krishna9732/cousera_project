import { Injectable } from '@angular/core';
import {Leader} from '../shared/leader';
import {LEADERS} from '../shared/leaders';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map,catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {baseURL} from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private ProcessHTTPMsgService: ProcessHTTPMsgService ) { }

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leadership').pipe(catchError(this.ProcessHTTPMsgService.handleError));
    // return of(LEADERS).pipe(delay(2000));
  }

  getLeader(id: number): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership/' + id).pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>(baseURL + 'leadership?featured=true').pipe(map(leadership => leadership[0])).pipe(catchError(this.ProcessHTTPMsgService.handleError));

    }

}
