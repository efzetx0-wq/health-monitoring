<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Models\User;

class AdminUserController extends Controller
{
    // GET ALL USERS
    public function index()
    {
        $users = User::latest()->get();

        return response()->json($users);
    }

    // UPDATE ROLE
    public function updateRole(
        Request $request,
        $id
    ) {

        $request->validate([

            'role' => 'required|in:admin,user,medical,guest'

        ]);

        $user = User::findOrFail($id);

        $user->role =
            $request->role;

        $user->save();

        return response()->json([

            'message' =>
            'Role updated successfully',

            'user' => $user
        ]);
    }

    // DELETE USER
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return response()->json([

            'message' =>
            'User deleted successfully'
        ]);
    }
}