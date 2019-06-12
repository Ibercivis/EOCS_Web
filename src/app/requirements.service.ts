import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RequirementsService {
  
  baseURL = "http://193.146.116.148:3000";

  constructor(private httpClient: HttpClient) { }

  getRequirements(): Observable<any> {
    const url = this.baseURL + '/requirements';
    return this.httpClient.get(url);
  }

  getRequirementsByProject(project): Observable<any> {
    const url = 'http://193.146.116.148:9682/hitec/repository/twitter/account_name/' + project + '/all' ;
    return this.httpClient.get(url);
  }

  addObserveAccount(account): Observable<any> {
    const url = "http://193.146.116.148:9703/hitec/orchestration/twitter/observe/tweet/account/"
     + account +"/interval/hourly/lang/en"
     return this.httpClient.post(url, null);
  }

  insertRequirement(account, text): Observable<any> {
    const url = "http://193.146.116.148:9682/hitec/repository/twitter/store/tweet/"
    var body = [
      {
        "sentiment": "",
        "sentiment_score": 0,
        "status_id": ""+(Math.floor(Math.random() * (999999 - 100000)) + 100000),
        "in_reply_to_screen_name": ""+account,
        "tweet_class": "",
        "user_name": "FILE",
        "created_at": 20190601,
        "favorite_count": 0,
        "text": text,
        "lang": "en",
        "retweet_count": 0
      }
    ];
    return this.httpClient.post(url, JSON.stringify(body));
  }

  getProjects(): Observable<any> {
    const url = 'http://193.146.116.148:9682/hitec/repository/twitter/observables';
    return this.httpClient.get(url);
  }

  deleteRequirement(requirement): Observable<any> {
    const url = this.baseURL + '/requirement?requirement=' + requirement;
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError('deleteRequirement'))
    );
  }

  deleteProject(account){
    const url = 'http://193.146.116.148:9703/hitec/orchestration/twitter/observe/account/' + account;
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError('deleteProject'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead

      // TODO: better job of transforming error for user consumption
    //  this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };

  }

}
