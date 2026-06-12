import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplications } from '../services/applicationService';

export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const apps = getApplications({ status: statusFilter || undefined, track: trackFilter || undefined });
  const allApps = getApplications();
  const stats = { total: allApps.length, newThisWeek: allApps.filter(a => new Date(a.createdAt) > new Date(Date.now()-7*86400000)).length, inReview: allApps.filter(a => a.status==='InReview').length, approved: allApps.filter(a => ['Approved','CreditsDisbursed'].includes(a.status)).length };
  const badge = (s: string) => ({ New:'badge-new', InReview:'badge-inreview', Submitted:'badge-submitted', Approved:'badge-approved', CreditsDisbursed:'badge-disbursed', Completed:'badge-completed', Rejected:'badge-rejected' }[s] || '');
  const fmt = (n: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h2>Admin Dashboard</h2><p>Manage IW Migrate credit applications</p></div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Total Applications</div></div>
          <div className="stat-card"><div className="stat-value">{stats.newThisWeek}</div><div className="stat-label">New This Week</div></div>
          <div className="stat-card"><div className="stat-value">{stats.inReview}</div><div className="stat-label">In Review</div></div>
          <div className="stat-card"><div className="stat-value">{stats.approved}</div><div className="stat-label">Approved</div></div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Applications Pipeline</h3></div>
          <div className="filters">
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="">All Statuses</option><option value="New">New</option><option value="InReview">In Review</option><option value="Submitted">Submitted</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select>
            <select value={trackFilter} onChange={e=>setTrackFilter(e.target.value)}><option value="">All Tracks</option><option value="Express">Express</option><option value="Standard">Standard</option></select>
          </div>
          <div className="table-container"><table><thead><tr><th>Customer</th><th>Status</th><th>Track</th><th>Projected ARR</th><th>Platform</th><th>Submitted</th><th>Actions</th></tr></thead><tbody>
            {apps.map(app => (
              <tr key={app.id}><td><strong>{app.customerName}</strong><br/><span style={{fontSize:'12px',color:'#687078'}}>{app.customerAccountId}</span></td><td><span className={`badge ${badge(app.status)}`}>{app.status}</span></td><td><span className={`badge ${app.track==='Express'?'badge-express':'badge-standard'}`}>{app.track}</span></td><td>{fmt(app.customerSubmission.projectedArr)}</td><td>{app.customerSubmission.currentPlatform}</td><td>{fmtDate(app.customerSubmission.submittedAt)}</td><td><Link to={`/admin/application/${app.id}`} className="btn btn-sm btn-outline">Review</Link></td></tr>
            ))}
            {apps.length === 0 && <tr><td colSpan={7} style={{textAlign:'center',padding:'32px',color:'#687078'}}>No applications match filters.</td></tr>}
          </tbody></table></div>
        </div>
      </div>
    </div>
  );
}
