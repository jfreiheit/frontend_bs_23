import { Component, OnInit, inject } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { Member } from '../shared/member';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit{
  message = { message: ''};

  ngOnInit(): void {
    this.readAll();
  }

  bs = inject(BackendService)
  members: Member[] = [];

  readAll() {
    this.bs.getAllMembers().subscribe({
      next: (response) => {
          this.members = response;
          console.log(this.members);
          return this.members;
      },
      error: (err) => console.log(err),
      complete: () => console.log('getAllMembers() completed')
    }
    )
  }

  delete(id: number) {
    this.bs.deleteOneMember(id).subscribe({
      next: (response) => {
          this.message = response;
          console.log('message', this.message.message);
          this.readAll();
          return response;
      },
      error: (err) => console.log(err),
      complete: () => console.log('deleteOneMember() completed')
    }
    )
  }
}
