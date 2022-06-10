import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Subject, tap, throwError } from 'rxjs';

import { Post } from './post.model';


@Injectable({ providedIn: 'root' })
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) { }

    createAndStorePost(title: string, content: string) {
        const postData: Post = { title: title, content: content };
        this.http
            .post<{ name: string }>('https://ng-complete-guide-5f3a6-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
                postData,
                {
                    observe: 'response'
                })
            .subscribe({
                next: (responseData) => console.log(responseData),
                error: (e) => this.error.next(e),
                complete: () => console.info('complete')
            });
        // .subscribe(responseData => {
        //     console.log(responseData);
        // }, error => {
        //     this.error.next(error.message)
        // });
    }



    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'key');
        return this.http
            .get<{ [key: string]: Post }>('https://ng-complete-guide-5f3a6-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', {
                headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
                // params: new HttpParams().set('print', 'pretty')
                params: searchParams,
                responseType: 'json' //just for note, this is defaulted.
            })
            .pipe(
                map(responseData => {
                    const postsArray: Post[] = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postsArray.push({ ...responseData[key], id: key });
                        }
                    }
                    return postsArray;
                }), catchError(errorRes => {
                    //send to analytics server
                    return throwError(() => {
                        this.error.next(errorRes);
                    });
                })
            );
    }

    deletePosts() {
        return this.http.delete('https://ng-complete-guide-5f3a6-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', {
            observe: 'events',
        }
        ).pipe(
            tap(
                event => {
                    console.log(event);
                    if (event.type === HttpEventType.Sent){
                        //....
                    }
                    if (event.type === HttpEventType.Response){
                        console.log(event.body);
                    }
                }
            ));
    }
}