import { Component, OnInit, inject } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { Member } from '../shared/member';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit{
  ngOnInit(): void {
    this.readAll();
  }
  bs = inject(BackendService)
  members: Member[] = [];

  readAll(): void {
  this.bs.getAllMembers().subscribe(
        {
          next: (response) => {
                this.members = response;
                console.log(this.members);
                return this.members;
              },
          error: (err) => console.log(err),
          complete: () => console.log('getAllMembers() completed')
        })
  }

  delete(id: string): void {
    console.log('id', id)
    this.bs.deleteOneMember(id).subscribe(
        {
          next: (response) => {
                console.log(response);
                this.readAll();
              },
          error: (err) => console.log(err),
          complete: () => console.log('deleting completed')
        })
  }
}
