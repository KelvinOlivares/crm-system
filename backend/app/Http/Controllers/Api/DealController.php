<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deal;
use Illuminate\Http\Request;

class DealController extends Controller
{
    public function index(Request $request)
    {
        $query = Deal::where('user_id', $request->user()->id)->with('contact');

        if ($request->stage) {
            $query->where('stage', $request->stage);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $deals = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($deals);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'contact_id' => 'required|exists:contacts,id',
            'title' => 'required|string|max:255',
            'value' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'stage' => 'required|in:qualification,proposal,negotiation,closed-won,closed-lost',
            'probability' => 'nullable|integer|min:0|max:100',
            'expected_close_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $deal = Deal::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'currency' => $validated['currency'] ?? 'USD',
            'status' => 'open',
        ]);

        return response()->json($deal->load('contact'), 201);
    }

    public function show(Deal $deal)
    {
        $this->authorize('view', $deal);

        return response()->json(
            $deal->load('contact')->loadCount('activities')
        );
    }

    public function update(Request $request, Deal $deal)
    {
        $this->authorize('update', $deal);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'value' => 'sometimes|numeric|min:0',
            'stage' => 'sometimes|in:qualification,proposal,negotiation,closed-won,closed-lost',
            'probability' => 'nullable|integer|min:0|max:100',
            'expected_close_date' => 'nullable|date',
            'actual_close_date' => 'nullable|date',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:open,won,lost',
        ]);

        $deal->update($validated);

        return response()->json($deal->load('contact'));
    }

    public function destroy(Deal $deal)
    {
        $this->authorize('delete', $deal);

        $deal->delete();

        return response()->json(['message' => 'Deal deleted']);
    }

    public function pipeline(Request $request)
    {
        $deals = Deal::where('user_id', $request->user()->id)
            ->with('contact')
            ->get()
            ->groupBy('stage');

        $pipeline = [
            'qualification' => ['deals' => [], 'total' => 0],
            'proposal' => ['deals' => [], 'total' => 0],
            'negotiation' => ['deals' => [], 'total' => 0],
            'closed-won' => ['deals' => [], 'total' => 0],
            'closed-lost' => ['deals' => [], 'total' => 0],
        ];

        foreach ($deals as $stage => $stageDeals) {
            $pipeline[$stage]['deals'] = $stageDeals;
            $pipeline[$stage]['total'] = $stageDeals->sum('value');
        }

        return response()->json($pipeline);
    }
}
