import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivityService, Activity } from '../../services/activity.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activities',
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
          <a routerLink="/contacts" class="flex items-center px-6 py-3 hover:bg-gray-800">
            <i class="fas fa-users w-5 mr-3"></i> Contacts
          </a>
          <a routerLink="/deals" class="flex items-center px-6 py-3 hover:bg-gray-800">
            <i class="fas fa-handshake w-5 mr-3"></i> Deals
          </a>
          <a routerLink="/activities" class="flex items-center px-6 py-3 bg-gray-800">
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
            <h2 class="text-2xl font-bold text-gray-900">Activities</h2>
            <p class="text-gray-500">Manage your tasks and activities</p>
          </div>
          <button (click)="showModal = true" class="btn-primary">
            <i class="fas fa-plus mr-2"></i> Add Activity
          </button>
        </div>

        <!-- Filters -->
        <div class="card mb-6">
          <div class="flex gap-4">
            <select [(ngModel)]="typeFilter" (change)="loadActivities()" class="input-field w-48">
              <option value="">All Types</option>
              <option value="call">Calls</option>
              <option value="email">Emails</option>
              <option value="meeting">Meetings</option>
              <option value="task">Tasks</option>
              <option value="note">Notes</option>
            </select>
            <select [(ngModel)]="completedFilter" (change)="loadActivities()" class="input-field w-48">
              <option value="">All Status</option>
              <option value="false">Pending</option>
              <option value="true">Completed</option>
            </select>
          </div>
        </div>

        <!-- Activities List -->
        <div class="card">
          <div class="space-y-4">
            @for (activity of activities; track activity.id) {
              <div class="flex items-center p-4 bg-gray-50 rounded-lg"
                   [ngClass]="{ 'opacity-50': activity.completed }">
                <div class="p-3 rounded-full mr-4"
                     [ngClass]="{
                       'bg-blue-100': activity.type === 'call',
                       'bg-green-100': activity.type === 'email',
                       'bg-yellow-100': activity.type === 'meeting',
                       'bg-purple-100': activity.type === 'task',
                       'bg-gray-100': activity.type === 'note'
                     }">
                  <i class="fas text-lg"
                     [ngClass]="{
                       'fa-phone text-blue-600': activity.type === 'call',
                       'fa-envelope text-green-600': activity.type === 'email',
                       'fa-calendar text-yellow-600': activity.type === 'meeting',
                       'fa-tasks text-purple-600': activity.type === 'task',
                       'fa-sticky-note text-gray-600': activity.type === 'note'
                     }"></i>
                </div>
                <div class="flex-1">
                  <p class="font-medium" [ngClass]="{ 'line-through': activity.completed }">
                    {{ activity.subject }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ activity.due_date | date:'medium' }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="toggleComplete(activity)"
                          class="p-2 rounded-full hover:bg-gray-200">
                    <i class="fas"
                       [ngClass]="{
                         'fa-check-circle text-green-600': activity.completed,
                         'fa-circle text-gray-400': !activity.completed
                       }"></i>
                  </button>
                  <button (click)="deleteActivity(activity.id)"
                          class="p-2 rounded-full hover:bg-gray-200 text-red-600">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </main>
    </div>

    <!-- Modal -->
    @if (showModal) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="card w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">Add Activity</h3>
          <form (ngSubmit)="saveActivity()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select [(ngModel)]="formData.type" name="type" class="input-field">
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="task">Task</option>
                <option value="note">Note</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input [(ngModel)]="formData.subject" name="subject" class="input-field" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input [(ngModel)]="formData.due_date" name="due_date" type="datetime-local" class="input-field" />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea [(ngModel)]="formData.description" name="description" class="input-field" rows="3"></textarea>
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
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  showModal = false;
  typeFilter = '';
  completedFilter = '';
  formData: any = {};

  constructor(
    private activityService: ActivityService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    this.activityService
      .getActivities({ type: this.typeFilter, completed: this.completedFilter })
      .subscribe({
        next: (response) => (this.activities = response.data),
        error: (err) => console.error(err),
      });
  }

  toggleComplete(activity: Activity) {
    this.activityService
      .updateActivity(activity.id, { completed: !activity.completed })
      .subscribe({
        next: () => this.loadActivities(),
      });
  }

  saveActivity() {
    this.activityService.createActivity(this.formData).subscribe({
      next: () => {
        this.loadActivities();
        this.closeModal();
      },
    });
  }

  deleteActivity(id: number) {
    if (confirm('Are you sure?')) {
      this.activityService.deleteActivity(id).subscribe({
        next: () => this.loadActivities(),
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.formData = {};
  }

  logout() {
    this.authService.logout();
  }
}
