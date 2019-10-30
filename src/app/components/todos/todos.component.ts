import { Component , OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { Todo } from '../../shared/todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.sass']
})
export class TodosComponent implements OnInit {
    todos: Todo[] = [];
     id = this.todos.length + 1 ;
    newTodo: Todo = {
        id: this.id,
        date: new Date(),
        completed: false,
    } ;
    constructor(private api: ApiService) { }

    ngOnInit() {
        return this.api.getTodos().subscribe((data) => {
            this.todos = data;
        });
  }

    newElement() {
        this.newTodo.todo = this.todoInput;
        this.todos.push(this.newTodo);
        this.todoInput = '';
    }

}
