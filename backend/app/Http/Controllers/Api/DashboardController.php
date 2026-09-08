<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $stats = [
            'total_contacts' => Contact::where('user_id', $userId)->count(),
            'total_deals' => Deal::where('user_id', $userId)->count(),
            'open_deals' => Deal::where('user_id', $userId)->where('status', 'open')->count(),
            'won_deals' => Deal::where('user_id', $userId)->where('status', 'won')->count(),
            'total_revenue' => Deal::where('user_id', $userId)->where('status', 'won')->sum('value'),
            'pipeline_value' => Deal::where('user_id', $userId)->where('status', 'open')->sum('value'),
            'pending_activities' => Activity::where('user_id', $userId)->where('completed', false)->count(),
        ];

        $recent_contacts = Contact::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recent_deals = Deal::where('user_id', $userId)
            ->with('contact')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $upcoming_activities = Activity::where('user_id', $userId)
            ->where('completed', false)
            ->where('due_date', '>=', now())
            ->with(['contact', 'deal'])
            ->orderBy('due_date', 'asc')
            ->limit(5)
            ->get();

        $deals_by_stage = Deal::where('user_id', $userId)
            ->where('status', 'open')
            ->select('stage', DB::raw('count(*) as count'), DB::raw('sum(value) as total'))
            ->groupBy('stage')
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_contacts' => $recent_contacts,
            'recent_deals' => $recent_deals,
            'upcoming_activities' => $upcoming_activities,
            'deals_by_stage' => $deals_by_stage,
        ]);
    }
}
