import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  ngOnInit(): void {
    this.fetchPost();
  }
  constructor(private http: HttpClient) { }


  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.http
      .post('https://ng-complete-guide-5f3a6-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
        postData)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  private fetchPost() {
    this.http
      .get('https://ng-complete-guide-5f3a6-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
      .pipe(
        map(responseData => {
          const postsArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }))
      .subscribe((posts => {
        console.log(posts);
      })

      )
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPost();
  }

  onClearPosts() {
    // Send Http request
  }
}
