import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/firebaseSim';
import { UserProfile } from '../../types';
import { Shield, ShieldAlert, Ban, CheckCircle } from 'lucide-react';

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setUsers(await dbService.getAllUsers());
    };

    const toggleRole = async (uid: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        await dbService.updateUserRole(uid, newRole);
        loadUsers();
    };

    const toggleStatus = async (uid: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'banned' : 'active';
        await dbService.updateUserStatus(uid, newStatus);
        loadUsers();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">User Management System</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-800">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-zinc-900 text-white uppercase font-bold">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-black">
                        {users.map(user => (
                            <tr key={user.uid} className="hover:bg-zinc-900/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-chuma-gold text-black' : 'bg-gray-800'}`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1 ${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                                        {user.status === 'active' ? <CheckCircle size={14} /> : <Ban size={14} />}
                                        {user.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button 
                                        onClick={() => toggleRole(user.uid, user.role)}
                                        className="p-2 hover:bg-gray-800 rounded text-blue-400"
                                        title="Toggle Admin"
                                    >
                                        <Shield size={18} />
                                    </button>
                                    <button 
                                        onClick={() => toggleStatus(user.uid, user.status)}
                                        className="p-2 hover:bg-gray-800 rounded text-red-500"
                                        title={user.status === 'active' ? "Ban User" : "Restore User"}
                                    >
                                        <ShieldAlert size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;
