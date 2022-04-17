import { ToastrService } from 'ngx-toastr';
import { AdminService } from './../admin.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: Partial<User[]>;
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService,
    private modalService: BsModalService,
    private toast: ToastrService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }



  getUsersWithRoles() {
    this.adminService.getUserWithRoles().subscribe(users => {
      this.users = users;
    })
  }

  openRolesModal(user: User) {
    const config: ModalOptions = {
      class: 'model-dialog-centered',
      initialState: {
        user,
        roles : this.getRolesArray(user)
      }
    }

    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe(values =>{     
      const rolesToupdate = {
        roles: [...values.filter(el=> el.checked === true).map(el => el.name)]
      };
      if(rolesToupdate && rolesToupdate.roles.length > 0){
        this.adminService.updateUserRoles(user.username, rolesToupdate.roles).subscribe(()=>{
          user.roles = [...rolesToupdate.roles]
        })
      }else { this.toast.info("Please select role..!!","Update Roles") }
    })
  }

  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const avaialableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' }
    ];

    avaialableRoles.forEach(role => {
      let isMatch = false;
      for (const userRole of userRoles) {
        if (role.name === userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    })
    return roles;
  }
}
