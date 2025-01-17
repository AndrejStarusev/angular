import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserInterface } from '../../../../interfaces';
import { ApiService } from '../../../core/services';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  displayedColumns = ['first_name', 'last_name', 'email'];
  userList: any[] = [];
  pagesCount: number;
  currentPage: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (this.currentPage) {
          this.api.fetchUsers(this.currentPage).subscribe(res => this.userList = res);
        }
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.data.pipe(map(data => data.users))
      .subscribe((users: UserInterface[]) => {
        this.userList = users;
      });

    this.activatedRoute.data.pipe(map(data => data.paginationInfo))
      .subscribe(paginationInfo => {
        this.pagesCount = paginationInfo.total;
      });
  }

  pageChanged(event: PageEvent): void {
    const page: number = event.pageIndex + 1;
    this.currentPage = page;
    this.router.navigate(['./'], { queryParams: { page } });
  }

  userSelected(user: UserInterface): void {
    this.router.navigate(['./user', user.id]);
  }
}
