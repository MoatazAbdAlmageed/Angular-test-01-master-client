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
  todos: Todo[] = [];
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
    return this.api.getTodos().subscribe((data) => {
      this.todos = data;
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
    this.api.addTodo(payload).subscribe((data) => {
      this.listTodos();
    }, (err) => {
      console.log(err);
    });
  }

}
