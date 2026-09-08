<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::where('user_id', $request->user()->id)->with(['contact', 'deal']);

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->completed !== null) {
            $query->where('completed', $request->boolean('completed'));
        }

        $activities = $query->orderBy('due_date', 'asc')
            ->paginate($request->get('per_page', 15));

        return response()->json($activities);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'contact_id' => 'nullable|exists:contacts,id',
            'deal_id' => 'nullable|exists:deals,id',
            'type' => 'required|in:call,email,meeting,task,note',
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $activity = Activity::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'completed' => false,
        ]);

        return response()->json($activity->load(['contact', 'deal']), 201);
    }

    public function show(Activity $activity)
    {
        $this->authorize('view', $activity);

        return response()->json($activity->load(['contact', 'deal']));
    }

    public function update(Request $request, Activity $activity)
    {
        $this->authorize('update', $activity);

        $validated = $request->validate([
            'type' => 'sometimes|in:call,email,meeting,task,note',
            'subject' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'completed' => 'boolean',
        ]);

        if ($request->boolean('completed') && !$activity->completed) {
            $validated['completed_at'] = now();
        }

        $activity->update($validated);

        return response()->json($activity->load(['contact', 'deal']));
    }

    public function destroy(Activity $activity)
    {
        $this->authorize('delete', $activity);

        $activity->delete();

        return response()->json(['message' => 'Activity deleted']);
    }
}
