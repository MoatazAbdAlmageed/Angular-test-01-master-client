import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { Todo } from '../../shared/todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.sass']
})
export class TodosComponent implements OnInit {
    todos: Todo[] = [];
    constructor(private api: ApiService) { }

    ngOnInit() {
        return this.api.getTodos().subscribe((data) => {
            this.todos = data;
        });

        // this.api.getTodos()
        //     .subscribe(res => {
        //         console.log('moataz'  , res);
        //         this.todos = res;
        //     }, err => {
        //         console.log(err);
        //     });
  }

}
