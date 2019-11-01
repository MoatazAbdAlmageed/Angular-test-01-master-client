import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Todo} from './todo';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = 'http://localhost:5000/todoApp';

  constructor(private http: HttpClient) {

  }

  getTodos(){
    return this.http.get<Todo[]>(`${this.apiUrl}/todos`)
      .pipe(
        tap(todos => console.log('fetched todos' , todos)),
        catchError(this.handleError('getTodos', 'error'))
      );
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}/todo`, todo).pipe(
      tap((item: Todo) => console.log(`added todo w/ id=${item.id}`)),
      catchError(this.handleError<Todo>('addTodo'))
    );
  }

  updateTodo(todo): Observable<any> {
    const url = `${this.apiUrl}/todo/`;
    return this.http.patch(url, todo).pipe(
      tap(_ => console.log(`updated todo id=${todo.id}`)),
      catchError(this.handleError<any>('updateTodo'))
    );
  }

  deleteTodo(id): Observable<any> {
    const url = `${this.apiUrl}/todo/${id}`;
    return this.http.delete(url).pipe(
      tap(_ => console.log(`deleted todo id=${id}`)),
      catchError(this.handleError('deletetodo'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.log('handleError');
      console.log(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
