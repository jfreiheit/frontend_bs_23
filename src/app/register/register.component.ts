import { Component, TemplateRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '../shared/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private modalService = inject(NgbModal);
  private bs = inject(BackendService);
  private router = inject(Router);
  closeResult = '';

  firstnameFC = new FormControl('', [Validators.required]);
  lastnameFC = new FormControl('', [Validators.required]);
  emailFC = new FormControl('', [Validators.required, Validators.email]);

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

      this.bs.createNewMember(member).subscribe({
          next: (response) => console.log('response', response),
          error: (err) => console.log(err),
          complete: () => console.log('register completed')
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
