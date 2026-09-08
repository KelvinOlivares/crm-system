import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DealService, Deal } from '../../services/deal.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-deals',
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
          <a routerLink="/deals" class="flex items-center px-6 py-3 bg-gray-800">
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
            <h2 class="text-2xl font-bold text-gray-900">Deals Pipeline</h2>
            <p class="text-gray-500">Track your sales pipeline</p>
          </div>
          <button (click)="showModal = true" class="btn-primary">
            <i class="fas fa-plus mr-2"></i> Add Deal
          </button>
        </div>

        <!-- Pipeline View -->
        <div class="grid grid-cols-5 gap-4 mb-8">
          @for (stage of stages; track stage.key) {
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-700">{{ stage.label }}</h3>
                <span class="text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {{ getStageDeals(stage.key).length }}
                </span>
              </div>
              <div class="space-y-3">
                @for (deal of getStageDeals(stage.key); track deal.id) {
                  <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md"
                       (click)="editDeal(deal)">
                    <p class="font-medium text-sm">{{ deal.title }}</p>
                    <p class="text-primary-600 font-semibold mt-1">
                      {{ deal.value | currency }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ deal.contact?.first_name }} {{ deal.contact?.last_name }}
                    </p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </main>
    </div>

    <!-- Modal -->
    @if (showModal) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="card w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">
            {{ editingDeal ? 'Edit Deal' : 'Add Deal' }}
          </h3>
          <form (ngSubmit)="saveDeal()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input [(ngModel)]="formData.title" name="title" class="input-field" required />
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input [(ngModel)]="formData.value" name="value" type="number" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select [(ngModel)]="formData.stage" name="stage" class="input-field">
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed-won">Closed Won</option>
                  <option value="closed-lost">Closed Lost</option>
                </select>
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact ID</label>
              <input [(ngModel)]="formData.contact_id" name="contact_id" type="number" class="input-field" required />
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
export class DealsComponent implements OnInit {
  deals: Deal[] = [];
  showModal = false;
  editingDeal: Deal | null = null;
  formData: any = {};

  stages = [
    { key: 'qualification', label: 'Qualification' },
    { key: 'proposal', label: 'Proposal' },
    { key: 'negotiation', label: 'Negotiation' },
    { key: 'closed-won', label: 'Closed Won' },
    { key: 'closed-lost', label: 'Closed Lost' },
  ];

  constructor(
    private dealService: DealService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDeals();
  }

  loadDeals() {
    this.dealService.getDeals().subscribe({
      next: (response) => (this.deals = response.data),
      error: (err) => console.error(err),
    });
  }

  getStageDeals(stage: string): Deal[] {
    return this.deals.filter((d) => d.stage === stage);
  }

  editDeal(deal: Deal) {
    this.editingDeal = deal;
    this.formData = { ...deal };
    this.showModal = true;
  }

  saveDeal() {
    if (this.editingDeal) {
      this.dealService.updateDeal(this.editingDeal.id, this.formData).subscribe({
        next: () => {
          this.loadDeals();
          this.closeModal();
        },
      });
    } else {
      this.dealService.createDeal(this.formData).subscribe({
        next: () => {
          this.loadDeals();
          this.closeModal();
        },
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingDeal = null;
    this.formData = {};
  }

  logout() {
    this.authService.logout();
  }
}
