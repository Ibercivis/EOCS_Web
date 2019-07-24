import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReqClass } from '../enums/req-class.enum';

@Injectable({
  providedIn: 'root'
})
export class RequirementsService {

  requirements;

  constructor(private httpClient: HttpClient) { }

  getRequirements() {
    return this.requirements;
  }

  addObserveAccount(account): Observable<any> {
    const url = environment.microservices_url + ":9703/hitec/orchestration/twitter/observe/tweet/account/"
      + account + "/interval/hourly/lang/en"
    return this.httpClient.post(url, null);
  }

  deleteProject(account) {
    const url = environment.microservices_url + ':9703/hitec/orchestration/twitter/observe/account/'
      + account;
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError('deleteProject'))
    );
  }

  getProjects(): Observable<any> {
    const url = environment.microservices_url + ':9682/hitec/repository/twitter/observables';
    return this.httpClient.get(url);
  }

  getRequirementsByProject(project): Observable<any> {
    const url = environment.microservices_url + ':9682/hitec/repository/twitter/account_name/'
      + project + '/all';
    return this.httpClient.get(url).pipe(tap(requirements => {
      this.requirements = requirements;
    }));
  }

  insertRequirement(account, text, reqClass, from): Observable<any> {
    const url = environment.microservices_url + ":9682/hitec/repository/twitter/store/tweet/"
    if (Object.values(ReqClass).includes(reqClass)) {
      reqClass = reqClass.toLowerCase();
    } else {
      reqClass = ReqClass.IRRELEVANT;
    }
    var body = [
      {
        "sentiment": "",
        "sentiment_score": 0,
        "status_id": "" + (Math.floor(Math.random() * (999999 - 100000)) + 100000),
        "in_reply_to_screen_name": account,
        "tweet_class": reqClass,
        "user_name": from,
        "created_at": 20190601,
        "favorite_count": 0,
        "text": text,
        "lang": "en",
        "retweet_count": 0
      }
    ];
    return this.httpClient.post(url, JSON.stringify(body));
  }

  deleteRequirement(requirement): Observable<any> {
    const url = environment.backend_url + '/requirement?requirement=' + requirement;
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError('deleteRequirement'))
    );
  }

  deleteProjectRequirements(selectedAccount) {
    const url = environment.backend_url + '/requirements?account=' + selectedAccount;
    return this.httpClient.delete(url).pipe(
      catchError(this.handleError('deleteProjectRequirements'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T);
    };
  }
  /*
    createProjectEdemocracy(project, requirements, candidatesDate, endDate) : Observable<any> {
      console.log(project);
      let url = environment.microservices_url + ":9750/api/projects?";
  
      let tickets = "";
      let index = 0;
      for (let req of requirements) {
        let text = req.text.replace(/#/g,''); // 400 response with query string params if it has a # character
        let urlTicket ="tickets[" + index + "][url]=url";
        let titletTicket = "&tickets[" + index + "][title]=" + text;
        let idTicket = "&tickets[" + index + "][id]=" + index;
        let externalIdTicket = "&tickets[" + index + "][external_id]=" + req.status_id.slice(-7);
        let descriptionTicket = "&tickets[" + index + "][description]=" + text;
        tickets += urlTicket + titletTicket + idTicket + externalIdTicket + descriptionTicket + "&";
        index++;
      }
      url += tickets;
  
      let body = new URLSearchParams();
      body.set('title', project);
     
      //TODO create form with phase dates
      body.set('phase_candidates', candidatesDate);
      body.set('phase_end', endDate);
      body.set('id', '10');
  
      url += body;
      return this.httpClient.post(url, JSON.stringify(body));
    }
    */

  createProjectEdemocracy(project, requirements, candidatesDate, endDate): Observable<any> {
    let url = environment.microservices_url + ":9750/api/projects";
    let tickets = [];
    let index = 0;

    for (let req of requirements) {
      let text = req.text.replace(/#/g, ''); // 400 response with query string params if it has a # character
      let newTicket = {
        url: "url",
        title: text,
        id: index,
        external_id: req.status_id.slice(-7),
        description: text
      };
      tickets.push(newTicket);
      index++;
    }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    let body = {
      "tickets": tickets,
      "title": project,
      "phase_candidates": candidatesDate,
      "phase_end": endDate,
      "id": '10'
    };

    return this.httpClient.post(url, JSON.stringify(body), { headers: headers });
  }

  getProjectEdemocracy(idProject): Observable<any> {
    const url = environment.microservices_url + ':9750/api/projects/' + idProject;
    return this.httpClient.get(url);
  }

  getProjectsEdemocracy(): Observable<any> {
    const url = environment.microservices_url + ':9750/api/projects/';
    return this.httpClient.get(url);
  }

  createParticipation(session, rol, projectId, candidate_summary): Observable<any> {
    const url = environment.microservices_url + ':9750/api/projects/' + projectId + '/participations/current';
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', session.token);
    headers = headers.append('Content-Type', 'application/json');
    let body = {
      "user_id": session.userId,
      "role": rol,
      "project_id": projectId,
      "candidate_summary": candidate_summary

    };
    return this.httpClient.post(url, JSON.stringify(body), { headers: headers });
  }

  getParticipants(projectId): Observable<any> {
    const url = environment.microservices_url + ':9750/api/projects/' + projectId + '/participations/';
    return this.httpClient.get(url);
  }

  /**
   * Vote or delegate vote.
   * 
   * @param projectId 
   * @param token 
   * @param id It can be userId or ticketId depending context delegate or vote
   */
  vote(projectId, token, id): Observable<any> {
    const url = environment.microservices_url + ':9750/api/projects/' + projectId + '/participations/current/votes';
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', token);
    headers = headers.append('Content-Type', 'application/json');
    let body = {
      "votes": [id]
    };
    return this.httpClient.put(url, body, { headers: headers });
  }

  getProjectParticipationForUser(projectId, token): Observable<any> {
    const url = environment.microservices_url + ':9750/api/projects/' + projectId + '/participations/current/votes';
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', token);
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient.get(url, { headers: headers });
  }

  getTicketsEdemocracy(projectId): Observable<any> {
    const url = environment.microservices_url + ':9750/api/projects/' + projectId + '/tickets';
    return this.httpClient.get(url);
  }

  getReport(projectId): Observable<any> {
    const url = environment.microservices_url + ':9750/api/projects/' + projectId + '/report';
    return this.httpClient.get(url);
  }

}
