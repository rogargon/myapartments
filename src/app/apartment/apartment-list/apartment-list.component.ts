import { Component, OnInit } from '@angular/core';
import { Apartment } from '../apartment';
import { ApartmentService } from '../apartment.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../login-basic/user';
import { AuthenticationBasicService } from '../../login-basic/authentication-basic.service';
import { ErrorMessageService } from '../../error-handler/error-message.service';

@Component({
  selector: 'app-apartment-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.css']
})
export class ApartmentListComponent implements OnInit {

  public apartments: Apartment[] = [];
  public currentUser: User = new User();
  public isShowed: boolean = false;

  constructor(
    private router: Router,
    private apartmentService: ApartmentService,
    private authenticationService: AuthenticationBasicService,
    private errorMessageService: ErrorMessageService,
  ) {
  }

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCurrentUser();
    this.isShowed = this.isOwner();

    if (!this.isShowed) {
      this.onNotShowed();
      return;
    }

    if (this.currentUser) {
      this.apartmentService.findByOwner(this.currentUser).subscribe({

        next: (resourceCollection) => {
          this.apartments = resourceCollection.resources || [];
        },
        error: () => {
          this.errorMessageService.showErrorMessage('Failed to load apartments');
        },
      });
    } else {
      this.errorMessageService.showErrorMessage('Failed to load apartments');
    }
  }

  private isOwner(): boolean {
    return this.currentUser.getRoles().includes('owner');
  }

  private onNotShowed(): void {
    this.errorMessageService.showErrorMessage('You are not an owner');
    this.router.navigate(['/apartments']);
  }
}
