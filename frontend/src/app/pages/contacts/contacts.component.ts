import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactService, Contact } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <aside class="sidebar">
        <div class="p-6">
          <h1 class="text-xl font-bold">CRM System</h1>
        </div>
        <nav class="mt-6">
          <a routerLink="/" class="flex items-center px-6 py-3 hover:bg-gray-800">
            <i class="fas fa-chart-pie w-5 mr-3"></i> Dashboard
          </a>
          <a routerLink="/contacts" class="flex items-center px-6 py-3 bg-gray-800">
            <i class="fas fa-users w-5 mr-3"></i> Contacts
          </a>
          <a routerLink="/deals" class="flex items-center px-6 py-3 hover:bg-gray-800">
            <i class="fas fa-handshake w-5 mr-3"></i> Deals
          </a>
          <a routerLink="/activities" class="flex items-center px-6 py-3 hover:bg-gray-800">
            <i class="fas fa-tasks w-5 mr-3"></i> Activities
          </a>
        </nav>
        <div class="absolute bottom-0 w-64 p-6">
          <button (click)="logout()" class="text-gray-400 hover:text-white">
            <i class="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </div>
      </aside>

      <main class="flex-1 p-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Contacts</h2>
            <p class="text-gray-500">Manage your contacts</p>
          </div>
          <button (click)="showModal = true" class="btn-primary">
            <i class="fas fa-plus mr-2"></i> Add Contact
          </button>
        </div>

        <!-- Search -->
        <div class="card mb-6">
          <div class="flex gap-4">
            <input
              type="text"
              [(ngModel)]="search"
              (input)="loadContacts()"
              placeholder="Search contacts..."
              class="input-field flex-1"
            />
            <select [(ngModel)]="statusFilter" (change)="loadContacts()" class="input-field w-48">
              <option value="">All Status</option>
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Contacts Table -->
        <div class="card overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="table-header">
              <tr>
                <th class="px-6 py-3">Name</th>
                <th class="px-6 py-3">Email</th>
                <th class="px-6 py-3">Company</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Deals</th>
                <th class="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (contact of contacts; track contact.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span class="text-primary-600 font-medium">
                          {{ contact.first_name.charAt(0) }}{{ contact.last_name.charAt(0) }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="font-medium text-gray-900">
                          {{ contact.first_name }} {{ contact.last_name }}
                        </div>
                        <div class="text-sm text-gray-500">{{ contact.position }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ contact.email }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ contact.company }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [ngClass]="{
                            'bg-green-100 text-green-800': contact.status === 'active',
                            'bg-yellow-100 text-yellow-800': contact.status === 'lead',
                            'bg-blue-100 text-blue-800': contact.status === 'prospect',
                            'bg-gray-100 text-gray-800': contact.status === 'inactive'
                          }">
                      {{ contact.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ contact.deals_count }}</td>
                  <td class="px-6 py-4 text-sm">
                    <button (click)="editContact(contact)" class="text-primary-600 hover:text-primary-900 mr-3">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button (click)="deleteContact(contact.id)" class="text-red-600 hover:text-red-900">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- Modal -->
    @if (showModal) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="card w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            {{ editingContact ? 'Edit Contact' : 'Add Contact' }}
          </h3>
          <form (ngSubmit)="saveContact()">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input [(ngModel)]="formData.first_name" name="first_name" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input [(ngModel)]="formData.last_name" name="last_name" class="input-field" required />
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input [(ngModel)]="formData.email" name="email" type="email" class="input-field" />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input [(ngModel)]="formData.phone" name="phone" class="input-field" />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input [(ngModel)]="formData.company" name="company" class="input-field" />
            </div>
            <div class="flex justify-end gap-3">
              <button type="button" (click)="closeModal()" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  showModal = false;
  editingContact: Contact | null = null;
  search = '';
  statusFilter = '';
  formData: any = {};

  constructor(
    private contactService: ContactService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.contactService
      .getContacts({ search: this.search, status: this.statusFilter })
      .subscribe({
        next: (response) => (this.contacts = response.data),
        error: (err) => console.error(err),
      });
  }

  editContact(contact: Contact) {
    this.editingContact = contact;
    this.formData = { ...contact };
    this.showModal = true;
  }

  saveContact() {
    if (this.editingContact) {
      this.contactService.updateContact(this.editingContact.id, this.formData).subscribe({
        next: () => {
          this.loadContacts();
          this.closeModal();
        },
      });
    } else {
      this.contactService.createContact(this.formData).subscribe({
        next: () => {
          this.loadContacts();
          this.closeModal();
        },
      });
    }
  }

  deleteContact(id: number) {
    if (confirm('Are you sure?')) {
      this.contactService.deleteContact(id).subscribe({
        next: () => this.loadContacts(),
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingContact = null;
    this.formData = {};
  }

  logout() {
    this.authService.logout();
  }
}
