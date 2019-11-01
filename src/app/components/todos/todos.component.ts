import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../shared/api.service';
import {Todo} from '../../shared/todo';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.sass']
})

export class TodosComponent implements OnInit {
  todos: Todo[];
  currentTodo: Todo;
  todoForm: FormGroup;
  modalOptions: NgbModalOptions;
  closeResult: string;

  constructor(private formBuilder: FormBuilder, private api: ApiService, private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    };
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
      // this.todos = todos;
      this.listTodos();
    }, (err) => {
      console.log(err);
    });
  }


  updateTodo(todo, b: boolean  = false ) {
    console.log('updateTodo');
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

  /* Modal*/
  open(content, todo ) {
    this.currentTodo = todo;
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      todo.todo = result.title.value;
      this.updateTodo(todo);

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    console.log(this.closeResult);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
