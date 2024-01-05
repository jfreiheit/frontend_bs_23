import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '../shared/backend.service';
import { Member } from '../shared/member';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit{
  id: string = '';
  member!: Member;
  closeResult = '';

  firstnameFC = new FormControl('', [Validators.required]);
  lastnameFC = new FormControl('', [Validators.required]);
  emailFC = new FormControl('', [Validators.required, Validators.email]);

  private modalService = inject(NgbModal);
  private bs = inject(BackendService)
  private route = inject(ActivatedRoute)
  private router = inject(Router);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.readOne(this.id);
  }

  readOne(id: string): void {
    this.bs.getOneMember(id).subscribe(
    {
      next: (response: Member) => {
              this.member = response;
              console.log(this.member);
              this.firstnameFC.setValue(this.member.firstname);
              this.lastnameFC.setValue(this.member.lastname);
              this.emailFC.setValue(this.member.email);
              return this.member;
      },
      error: (err) => console.log(err),
      complete: () => console.log('getOne() completed')
    });
  }

  private formValid() {
    return this.firstnameFC.valid && this.lastnameFC.valid && this.emailFC.valid;
  }

  register(content: TemplateRef<any>) {

    if(this.formValid())
    {
      let member = {
        id: '',
        firstname: this.firstnameFC.value!,
        lastname: this.lastnameFC.value!,
        email: this.emailFC.value!
      }

      this.bs.updateOneMember(member, this.id).subscribe({
          next: (response) => console.log('response', response),
          error: (err) => console.log(err),
          complete: () => console.log('update completed')
      });

      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.router.navigate(['/members']);
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );

      console.log('new member: ', member)
    }
    else
    {
      console.warn('form still invalid!')
    }
  }

  cancel() {
    this.firstnameFC.reset();
    this.lastnameFC.reset();
    this.emailFC.reset();
  }

  private getDismissReason(reason: any): string {
  switch (reason) {
    case ModalDismissReasons.ESC:
      return 'by pressing ESC';
    case ModalDismissReasons.BACKDROP_CLICK:
      return 'by clicking on a backdrop';
    default:
      return `with: ${reason}`;
  }
}
}
