import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from './member';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  backendUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getAllMembers(): Observable<Member[]> {
    let endpoint = '/members';
    return this.http.get<Member[]>(this.backendUrl + endpoint);
  }

  deleteOneMember(id: string): Observable<any> {
    let endpoint = '/members';
    return this.http.delete<any>(this.backendUrl + endpoint + "/" + id);
  }

  getOneMember(id: string): Observable<Member>{
    let endpoint = '/members';
    return this.http.get<Member>(this.backendUrl + endpoint + '/' + id);
  }

  createNewMember(member: Member): Observable<Member> {
    let endpoint = '/members';
    return this.http.post<Member>(this.backendUrl + endpoint, member);
  }

  updateOneMember(member: Member, id: string): Observable<Member> {
    let endpoint = '/members';
    return this.http.put<Member>(this.backendUrl + endpoint + "/" + id, member);
  }
}
