import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as btoa from 'btoa';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    baseUrl: string = environment.baseUrl;
    authCredentials: string = btoa(environment.authCredentials);

    constructor(
        private http: HttpClient
    ) { }


    initialSync() {

    }

    getHeaders(): HttpHeaders {
        return new HttpHeaders().set('Authorization', `Basic ${this.authCredentials}`);
    }

    getUnreadArticles() {
        return this.http.get(`${this.baseUrl}items?type=3&getRead=false&batchSize=-1`, {
            headers: this.getHeaders()
        });
    }

    markAsRead(itemId: string) {
        return this.http.put(`${this.baseUrl}items/${itemId}/read`, null, {
            headers: this.getHeaders()
        });
    }

    markAsUnread(itemId: string) {
        return this.http.put(`${this.baseUrl}items/${itemId}/unread`, null, {
            headers: this.getHeaders()
        });
    }

}
