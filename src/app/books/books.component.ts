import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subscription } from 'rxjs';
import { Post } from '../models/post.model';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent {
  constructor(private postService: PostService) {}
  //******************/
  subSubscription: Subscription | undefined;
  httperror: string | unknown = null;
  loadedPost: Post[] = [];
  isFetch: Boolean = false;
  //******************/
  ngOnInit() {
    this.isFetch = true;
    this.postService.fetchPost().subscribe((post: Post[]) => {
      this.isFetch = false;
      this.loadedPost = post;
    });
  }
  //******************/
  onCreatePost(postdata: Post) {
    this.postService.createPost(postdata.title, postdata.content);
    this.subSubscription = this.postService.errorsub.subscribe((error) => {
      this.httperror = error;
    });
  }
  //******************/
  onFetchPosts() {
    this.isFetch = true;
    this.postService.fetchPost().subscribe(
      (post: Post[]) => {
        this.isFetch = false;
        this.loadedPost = post;
      },
      (error) => {
        console.log(error);
        this.httperror = error.message;
      }
    );
  }
  //******************/
  onClearPosts() {
    this.postService.deletePost().subscribe(() => (this.loadedPost = []));
  }
  //******************/
  ngOnDestroy() {
    this.subSubscription?.unsubscribe();
  }
  //******************/
  onHandlingError() {
    this.isFetch = false;
    this.httperror = null;
  }
  //******************/
}
