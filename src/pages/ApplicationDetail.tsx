import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApplication, updateApplication } from '../services/applicationService';
import { Application, ApplicationStatus } from '../types';

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | undefined>(id ? getApplication(id) : undefined);
  const [repForm, setRepForm] = useState({ projectedArr: app?.customerSubmission.projectedArr.toString() || '', creditAmount: '', firstTranchePct: '15', workloadClassification: '', notes: '', assignedSa: app?.assignedSa || '' });
  const [saved, setSaved] = useState(false);

  if (!app) return <div className="page"><div className="container"><div className="alert alert-error">Application not found.</div><Link to="/admin" className="btn btn-outline">Back</Link></div></div>;

  const fmt = (n: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const badge = (s: string) => ({ New:'badge-new', InReview:'badge-inreview', Submitted:'badge-submitted', Approved:'badge-approved', CreditsDisbursed:'badge-disbursed', Completed:'badge-completed', Rejected:'badge-rejected' }[s] || '');

  const changeStatus = (s: ApplicationStatus) => { const u = updateApplication(app.id, { status: s }); if (u) setApp(u); };
  const saveRep = () => {
    const u = updateApplication(app.id, { repSubmission: { projectedArr: parseFloat(repForm.projectedArr), creditAmount: parseFloat(repForm.creditAmount)||0, firstTranchePct: parseInt(repForm.firstTranchePct), migrationStart: app.customerSubmission.migrationStart, migrationEnd: app.customerSubmission.migrationEnd, workloadClassification: repForm.workloadClassification, notes: repForm.notes, additionalDocs: [] }, assignedSa: repForm.assignedSa || undefined });
    if (u) { setApp(u); setSaved(true); setTimeout(()=>setSaved(false),3000); }
  };
  const submitToInvestments = () => { saveRep(); changeStatus('Submitted'); };

  return (
    <div className="page">
      <div className="container">
        <Link to="/admin" style={{fontSize:'14px'}}>Back to Dashboard</Link>
        <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginTop:'16px'}}>
          <div><h2>{app.customerName}</h2><p>Account: {app.customerAccountId}</p></div>
          <div style={{display:'flex',gap:'8px'}}><span className={`badge ${badge(app.status)}`}>{app.status}</span><span className={`badge ${app.track==='Express'?'badge-express':'badge-standard'}`}>{app.track}</span></div>
        </div>
        {saved && <div className="alert alert-success">Changes saved.</div>}
        <div className="detail-grid">
          <div>
            <div className="card">
              <div className="card-header"><h3>Customer Submission</h3><span style={{fontSize:'12px',color:'#687078'}}>Read-only</span></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
                <div className="detail-section"><h4>Platform</h4><p>{app.customerSubmission.currentPlatform}</p></div>
                <div className="detail-section"><h4>Projected ARR</h4><p>{fmt(app.customerSubmission.projectedArr)}</p></div>
                <div className="detail-section"><h4>Migration Window</h4><p>{fmtDate(app.customerSubmission.migrationStart)} - {fmtDate(app.customerSubmission.migrationEnd)}</p></div>
                <div className="detail-section"><h4>Target Account</h4><p>{app.customerSubmission.targetAccountId}</p></div>
              </div>
              <div className="detail-section" style={{marginTop:'12px'}}><h4>Workload</h4><p>{app.customerSubmission.workloadDescription}</p></div>
              <div style={{display:'flex',gap:'8px',marginTop:'12px'}}>
                {app.customerSubmission.isOpenaiMigration && <span className="badge badge-submitted">OpenAI</span>}
                {app.customerSubmission.isGcpGeminiMigration && <span className="badge badge-submitted">Gemini</span>}
                {app.customerSubmission.hasPartner && <span className="badge badge-new">Partner: {app.customerSubmission.partnerName}</span>}
              </div>
            </div>
            {app.track === 'Standard' && (
              <div className="card">
                <div className="card-header"><h3>Rep Working Copy</h3><span style={{fontSize:'12px',color:'#687078'}}>Editable</span></div>
                <div className="form-row">
                  <div className="form-group"><label>Projected ARR ($)</label><input type="number" value={repForm.projectedArr} onChange={e=>setRepForm({...repForm,projectedArr:e.target.value})}/></div>
                  <div className="form-group"><label>Credit Amount ($)</label><input type="number" value={repForm.creditAmount} onChange={e=>setRepForm({...repForm,creditAmount:e.target.value})}/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>First Tranche %</label><select value={repForm.firstTranchePct} onChange={e=>setRepForm({...repForm,firstTranchePct:e.target.value})}><option value="0">0%</option><option value="5">5%</option><option value="10">10%</option><option value="15">15%</option><option value="20">20%</option><option value="25">25%</option></select></div>
                  <div className="form-group"><label>Classification</label><select value={repForm.workloadClassification} onChange={e=>setRepForm({...repForm,workloadClassification:e.target.value})}><option value="">Select</option><option>Compute</option><option>Database</option><option>Analytics</option><option>AI/ML</option><option>Mixed</option></select></div>
                </div>
                <div className="form-group"><label>Assign SA</label><input type="text" value={repForm.assignedSa} onChange={e=>setRepForm({...repForm,assignedSa:e.target.value})} placeholder="SA alias"/></div>
                <div className="form-group"><label>Notes</label><textarea value={repForm.notes} onChange={e=>setRepForm({...repForm,notes:e.target.value})} placeholder="Internal notes..."/></div>
                <div style={{display:'flex',gap:'12px'}}><button className="btn btn-secondary" onClick={saveRep}>Save Draft</button><button className="btn btn-success" onClick={submitToInvestments}>Submit to Investments</button></div>
              </div>
            )}
          </div>
          <div>
            <div className="card">
              <div className="card-header"><h3>Actions</h3></div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {app.status==='New' && <button className="btn btn-primary" style={{width:'100%'}} onClick={()=>changeStatus('InReview')}>Start Review</button>}
                {app.status==='InReview' && <button className="btn btn-success" style={{width:'100%'}} onClick={submitToInvestments}>Submit to Investments</button>}
                {['Submitted','Approved'].includes(app.status) && <button className="btn btn-primary" style={{width:'100%'}} onClick={()=>changeStatus('CreditsDisbursed')}>Mark Disbursed</button>}
                {!['Rejected','Completed'].includes(app.status) && <button className="btn btn-danger" style={{width:'100%'}} onClick={()=>changeStatus('Rejected')}>Reject</button>}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h3>Assignment</h3></div>
              <div className="detail-section"><h4>Rep</h4><p>{app.assignedRep || 'Unassigned'}</p></div>
              <div className="detail-section"><h4>SA</h4><p>{app.assignedSa || 'None'}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
