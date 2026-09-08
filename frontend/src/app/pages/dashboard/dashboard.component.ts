import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, DashboardData } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <!-- Sidebar -->
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

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p class="text-gray-500">Welcome back, {{ user?.name }}</p>
        </div>

        @if (data) {
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
              <div class="flex items-center">
                <div class="p-3 bg-blue-100 rounded-full">
                  <i class="fas fa-users text-blue-600"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Total Contacts</p>
                  <p class="text-2xl font-bold">{{ data.stats.total_contacts }}</p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="p-3 bg-green-100 rounded-full">
                  <i class="fas fa-handshake text-green-600"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Open Deals</p>
                  <p class="text-2xl font-bold">{{ data.stats.open_deals }}</p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="p-3 bg-yellow-100 rounded-full">
                  <i class="fas fa-dollar-sign text-yellow-600"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Pipeline Value</p>
                  <p class="text-2xl font-bold">{{ data.stats.pipeline_value | currency }}</p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="p-3 bg-purple-100 rounded-full">
                  <i class="fas fa-check-circle text-purple-600"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Revenue Won</p>
                  <p class="text-2xl font-bold">{{ data.stats.total_revenue | currency }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card">
              <h3 class="text-lg font-semibold mb-4">Recent Deals</h3>
              <div class="space-y-4">
                @for (deal of data.recent_deals; track deal.id) {
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p class="font-medium">{{ deal.title }}</p>
                      <p class="text-sm text-gray-500">{{ deal.contact?.first_name }} {{ deal.contact?.last_name }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold">{{ deal.value | currency }}</p>
                      <p class="text-xs text-gray-500">{{ deal.stage }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="card">
              <h3 class="text-lg font-semibold mb-4">Upcoming Activities</h3>
              <div class="space-y-4">
                @for (activity of data.upcoming_activities; track activity.id) {
                  <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div class="p-2 rounded-full mr-3"
                         [ngClass]="{
                           'bg-blue-100': activity.type === 'call',
                           'bg-green-100': activity.type === 'email',
                           'bg-yellow-100': activity.type === 'meeting'
                         }">
                      <i class="fas text-sm"
                         [ngClass]="{
                           'fa-phone text-blue-600': activity.type === 'call',
                           'fa-envelope text-green-600': activity.type === 'email',
                           'fa-calendar text-yellow-600': activity.type === 'meeting'
                         }"></i>
                    </div>
                    <div>
                      <p class="font-medium">{{ activity.subject }}</p>
                      <p class="text-sm text-gray-500">{{ activity.due_date | date:'short' }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </main>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null = null;
  user: any;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => (this.data = data),
      error: (err) => console.error(err),
    });
  }

  logout() {
    this.authService.logout();
  }
}
