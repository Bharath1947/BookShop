import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient, private authserve: AuthService) {}
  //******************/
  isFetch: Boolean = true;
  loadedPost: Post[] = [];
  errorsub = new Subject<string>();
  //******************/
  createPost(title: string, content: string) {
    const postdata: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        'https://bookshop-66a48-default-rtdb.asia-southeast1.firebasedatabase.app/post.json',
        postdata,
        {
          observe: 'response',
          responseType: 'json',
        }
      )
      .subscribe(
        (resp) => {
          console.log(resp);
        },
        (error) => {
          console.log(error.message);
          this.errorsub.next(error.message);
        }
      );
  }
  //******************/

  fetchPost() {
    // let paramvalues = new HttpParams();
    // paramvalues = paramvalues.append('auth', 'pretty');
    return this.http
      .get<{ [key: string]: Post }>(
        'https://bookshop-66a48-default-rtdb.asia-southeast1.firebasedatabase.app/post.json'
      )
      .pipe(
        map((responsedata) => {
          const dataArray = [];
          for (const key in responsedata) {
            if (responsedata.hasOwnProperty(key)) {
              dataArray.push({ ...responsedata[key], id: key });
            }
          }
          return dataArray;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  //******************/
  deletePost() {
    return this.http
      .delete(
        'https://bookshop-66a48-default-rtdb.asia-southeast1.firebasedatabase.app/post.json',
        {
          observe: 'events',
        }
      )
      .pipe(
        tap((event) => {
          if (event.type == HttpEventType.Sent) {
            console.log('event.type' + event.type);
            console.log('HttpEventType.Sent' + HttpEventType.Sent);
          }
          if (event.type == HttpEventType.Response) {
            console.log('event.type' + event.type);
            console.log('HttpEventType.Sent' + HttpEventType.Response);
          }
        })
      );
  }

  //******************/
}
