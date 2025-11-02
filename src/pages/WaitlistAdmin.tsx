import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Download, RefreshCw, Mail, Calendar, Globe, Monitor, LogOut } from 'lucide-react';

interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

function WaitlistAdmin() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const ADMIN_PASSWORD = 'wiwiadmin2025';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      sessionStorage.setItem('wiwi_admin_auth', 'true');
      fetchWaitlist();
    } else {
      setAuthError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('wiwi_admin_auth');
    setEntries([]);
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem('wiwi_admin_auth') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWaitlist();
    }
  }, [isAuthenticated, sortOrder]);

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: sortOrder === 'asc' });

      if (fetchError) throw fetchError;

      setEntries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch waitlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchWaitlist();
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'Joined Date', 'IP Address', 'User Agent'];
    const csvData = entries.map(entry => [
      entry.email,
      new Date(entry.created_at).toLocaleString(),
      entry.ip_address || 'N/A',
      entry.user_agent || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wiwi-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredEntries = entries.filter(entry =>
    entry.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-purple-300" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h1>
          <p className="text-purple-200/70 text-center mb-6">Enter password to view waitlist</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-red-400 text-sm text-center">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-[1.02]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8 pt-4">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200 text-transparent bg-clip-text mb-4 tracking-tight">
              WiWi
            </h1>
            <p className="text-purple-200/80 text-lg md:text-xl font-light tracking-wide">
              Your AI Companion for Spiritual Wellness
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Waitlist Dashboard</h2>
              <p className="text-purple-200/70">
                Total Entries: <span className="font-semibold text-purple-300">{entries.length}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={handleExportCSV}
                disabled={entries.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 rounded-lg transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>
            <button
              onClick={toggleSortOrder}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 whitespace-nowrap"
            >
              Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-purple-300 animate-spin" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-purple-200/70">
              {searchQuery ? 'No entries match your search' : 'No waitlist entries yet'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-purple-200/70 font-medium text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </th>
                    <th className="text-left py-4 px-4 text-purple-200/70 font-medium text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Joined Date
                      </div>
                    </th>
                    <th className="text-left py-4 px-4 text-purple-200/70 font-medium text-sm hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        IP Address
                      </div>
                    </th>
                    <th className="text-left py-4 px-4 text-purple-200/70 font-medium text-sm hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        User Agent
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        index % 2 === 0 ? 'bg-white/5' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-white font-medium">{entry.email}</td>
                      <td className="py-4 px-4 text-purple-200/80 text-sm">
                        {new Date(entry.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-purple-200/70 text-sm hidden md:table-cell">
                        {entry.ip_address || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-purple-200/60 text-xs hidden lg:table-cell max-w-xs truncate">
                        {entry.user_agent || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaitlistAdmin;
