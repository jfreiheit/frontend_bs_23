import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '../shared/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../shared/member';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit{
  private modalService = inject(NgbModal);
  private bs = inject(BackendService);
  private router = inject(Router)
  private closeResult = '';
  private route = inject(ActivatedRoute)
  private id: string = '';
  private member!: Member;

  firstnameFC = new FormControl('', [Validators.required]);
  lastnameFC = new FormControl('', [Validators.required]);
  emailFC = new FormControl('', [Validators.required, Validators.email]);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log('id', this.id)
    this.bs.getOneMember(this.id).subscribe( (response) => {
      this.member = response;
      console.log('member', this.member)
      this.firstnameFC.setValue(this.member.firstname)
      this.lastnameFC.setValue(this.member.lastname)
      this.emailFC.setValue(this.member.email)
    })
  }




  private formValid() {
    return this.firstnameFC.valid && this.lastnameFC.valid && this.emailFC.valid;
  }

  update(content: TemplateRef<any>) {

    if(this.formValid())
    {
      let member = {
        id: 0,
        firstname: this.firstnameFC.value!,
        lastname: this.lastnameFC.value!,
        email: this.emailFC.value!
      }

      this.bs.updateOneMember(member, this.id).subscribe({
          next: (response) => console.log('response', response),
          error: (err) => console.log(err),
          complete: () => console.log('register completed')
      })

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
