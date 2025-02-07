import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';

import { Task } from './tasks/task';
import { TaskService } from './tasks/task.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


@Component({
  selector: 'tiny-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  now$: Observable<Date>;

  tasks$: Observable<Task[]>;

  doneTasks$: Observable<Task[]>;

  constructor(@Inject('TaskService') private taskService: TaskService) { }

  ngOnInit(): void {
    this.now$ = timer((60 - new Date().getSeconds()) * 1000, 60 * 1000)
      .pipe(startWith(0))
      .pipe(map(() => new Date()));
    this.tasks$ = this.taskService.getAll();
    this.doneTasks$ = this.getDoneTasks();
  }

  created(): void {
    this.tasks$ = this.taskService.getAll();
    this.doneTasks$ = this.getDoneTasks();
  }
  /**
   * deletes task and rerenders the view
   */
  deleted(): void {
    this.tasks$ = this.taskService.getAll();
    this.doneTasks$ = this.getDoneTasks();
  }
  /**
   * marks task as done and rerenders the view
   */
  checked(): void {
    this.tasks$ = this.taskService.getAll();
    this.doneTasks$ = this.getDoneTasks();
  }
  /**
   * get done tasks where task is checked
   */
  getDoneTasks(): Observable<Task[]> {
    return this.doneTasks$ = this.taskService.getAll().pipe(map((tasks: Task[]) => {
      return tasks.filter((task) => task.checked);
    }));
  }
  /**
   * deletes all and rerenders the view
   */
  deleteAll(): void {
    this.taskService.deleteAll().subscribe((success)=> {
      this.tasks$ = this.taskService.getAll();
      this.doneTasks$ = this.getDoneTasks();
    }
    );
  }
  /**
   * changes the status rerenders the view
   */
  statusChange(): void {
    this.tasks$ = this.taskService.getAll();
    this.doneTasks$ = this.getDoneTasks();
  }

}
