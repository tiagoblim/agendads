import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

import { Contato } from './contato/contato';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  apiUrl = environment.apiBaseUrl + "/contatos";

  constructor(
    private http: HttpClient
  ) { }

  save(contato: Contato): Observable<Contato> {
    return this.http.post<Contato>(this.apiUrl, contato);
  }

  list(): Observable<Contato[]> {
    return this.http.get<any>(this.apiUrl);
  }

  favorite(contato: Contato): Observable<any> {
    return this.http.patch(this.apiUrl + `/${contato.id}/favorito`, null);
  }

  upload(contato: Contato, formData: FormData): Observable<any> {
    return this.http.put(this.apiUrl + `/${contato.id}/foto`, formData, {responseType: 'blob'})
  }
}
