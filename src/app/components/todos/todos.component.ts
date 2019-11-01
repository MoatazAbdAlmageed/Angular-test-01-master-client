import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../shared/api.service';
import {Todo} from '../../shared/todo';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.sass']
})

export class TodosComponent implements OnInit {
  todos: Todo[];
  todoForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private api: ApiService) {
  }

  ngOnInit() {
    this.todoForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
    });
    this.listTodos();
  }

  listTodos() {
    return this.api.getTodos().subscribe((todos) => {
      this.todos = todos;
    });
  }

  addTodo() {
    const title = this.todoForm.controls.title.value;
    const payload: Todo = {
      date: new Date(),
      completed: false,
      todo: title,
    };
    payload.todo = title;
    this.api.addTodo(payload).subscribe((todos) => {
      this.todoForm.reset();
      this.todos = todos;
    }, (err) => {
      console.log(err);
    });
  }


  updateTodo(todo, b: boolean  = false ) {
    todo.complete  = b;
    this.api.updateTodo(todo).subscribe((todos) => {
      this.todos = todos;
    }, (err) => {
      console.log(err);
    });
  }



  removeTodo(id) {
    if (confirm('Are you sure to delete this todo?')) {
      this.api.deleteTodo(id).subscribe((todos) => {
        this.todos = todos;
    }, (err) => {
      console.log(err);
    });
    }
  }
}
