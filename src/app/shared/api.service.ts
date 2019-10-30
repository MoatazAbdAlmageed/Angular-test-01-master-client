import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Todo } from './todo';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    apiUrl = 'http://localhost:500/todoApp';
    constructor(private http: HttpClient) {

    }
    getTodos(): Observable<Todo[]> {
        return this.http.get<Todo[]>(this.apiUrl + '/todos')
            .pipe(
                tap(heroes => console.log('fetched todos')),
                catchError(this.handleError('getTodos', []))
            );
    }

    getTodo(id: number): Observable<Todo> {
        const url = `${this.apiUrl}?id=${id}`;
        return this.http.get<Todo>(url).pipe(
            tap(_ => console.log(`fetched todo id=${id}`)),
            catchError(this.handleError<Todo>(`getTodo id=${id}`))
        );
    }

    addTodo(todo): Observable<Todo> {

        return this.http.post<Todo>(`${this.apiUrl}/create.php`, todo).pipe(
            tap((todo: Todo) => console.log(`added todo w/ id=${todo.id}`)),
            catchError(this.handleError<Todo>('addTodo'))
        );
    }

    updateTodo(id, todo): Observable<any> {
        const url = `${this.apiUrl}/update.php?id=${id}`;
        return this.http.put(url, todo).pipe(
            tap(_ => console.log(`updated todo id=${id}`)),
            catchError(this.handleError<any>('updateTodo'))
        );
    }

    deleteTodo(id): Observable<Todo> {
        const url = `${this.apiUrl}/delete.php?id=${id}`;

        return this.http.delete<Todo>(url).pipe(
            tap(_ => console.log(`deleted todo id=${id}`)),
            catchError(this.handleError<Todo>('deletetodo'))
        );
    }
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
