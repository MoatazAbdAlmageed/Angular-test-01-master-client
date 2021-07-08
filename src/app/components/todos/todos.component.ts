import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../shared/api.service';
import {Todo} from '../../shared/todo';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.sass']
})

export class TodosComponent implements OnInit {
  todos: Todo[];
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
      completed: [],
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


  updateTodo(todo) {
    this.api.updateTodo(todo).subscribe((todos) => {
      this.todos = todos;
      const msg = todo.completed ? 'Good Job!' : 'Try to Work Hard!';
      swal.fire(msg);
    }, (err) => {
      console.log(err);
    });
  }
  updateTodoStatus(todo) {
    todo.completed = !todo.completed;
    this.updateTodo(todo);
  }




  removeTodo(id) {
    // @ts-ignore
    swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this task?',
      type: 'warning',
      showConfirmButton: true,
      showCancelButton: true
    })
      .then((willDelete) => {
        if (willDelete.value) {
          this.api.deleteTodo(id).subscribe((todos) => {
            this.todos = todos;
            swal.fire('Deleted');
          }, (err) => {
            console.log(err);
          });
        }
        console.log(willDelete);
      });
  }

  /* Modal*/
  open(content, todo ) {
   this.todoForm.controls.title.setValue(todo.todo);
   this.todoForm.controls.completed.setValue(todo.completed);
   this.modalService.open(content, this.modalOptions).result.then((result) => {
     console.log(this.todoForm.controls.completed);
     this.closeResult = `Closed with: ${result}`;
     todo.todo = this.todoForm.controls.title.value;
     todo.completed = this.todoForm.controls.completed.value;
     this.updateTodo(todo);
     this.todoForm.controls.title.setValue('');
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.todoForm.controls.title.setValue('');
    });
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
