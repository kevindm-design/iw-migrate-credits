import { useState } from 'react';
import { checkEligibility, calculateCreditEstimate, submitApplication } from '../services/applicationService';
import { CreditEstimate } from '../types';

export default function CustomerPortal() {
  const [step, setStep] = useState(1);
  const [accountId, setAccountId] = useState('');
  const [error, setError] = useState('');
  const [estimate, setEstimate] = useState<CreditEstimate | null>(null);
  const [track, setTrack] = useState<'Express'|'Standard'|null>(null);
  const [form, setForm] = useState({ currentPlatform: '', workloadDescription: '', projectedArr: '', migrationStart: '', migrationEnd: '', targetAccountId: '', isOpenaiMigration: false, isGcpGeminiMigration: false, hasPartner: false, partnerName: '' });

  const handleEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = checkEligibility(accountId);
    if (!result.eligible) { setError(result.reason || 'Not eligible.'); return; }
    setForm(f => ({ ...f, targetAccountId: accountId }));
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const arr = parseFloat(form.projectedArr);
    const est = calculateCreditEstimate(arr, form.isOpenaiMigration, form.isGcpGeminiMigration);
    setEstimate(est);
    const app = submitApplication(accountId, 'Customer', { currentPlatform: form.currentPlatform, workloadDescription: form.workloadDescription, projectedArr: arr, migrationStart: form.migrationStart, migrationEnd: form.migrationEnd, targetAccountId: form.targetAccountId, isOpenaiMigration: form.isOpenaiMigration, isGcpGeminiMigration: form.isGcpGeminiMigration, hasPartner: form.hasPartner, partnerName: form.partnerName || undefined, supportingDocs: [] });
    setTrack(app.track);
    setStep(3);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h2>Apply for Migration Credits</h2><p>Complete the form below to apply for AWS IW Migrate credits</p></div>
        <div className="stepper">
          {['Eligibility','Application','Estimate','Confirmation'].map((label, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',flex:1}}>
              <div className={`step ${step===i+1?'active':''} ${step>i+1?'completed':''}`}>
                <div className="step-number">{step > i+1 ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg> : i+1}</div>
                <span className="step-label">{label}</span>
              </div>
              {i < 3 && <div className={`step-line ${step > i+1 ? 'completed' : ''}`}/>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="card">
            <div className="card-header"><h3>Check Your Eligibility</h3></div>
            <form onSubmit={handleEligibility}>
              <div className="form-group">
                <label htmlFor="aid">AWS Account ID</label>
                <input id="aid" type="text" placeholder="123456789012" value={accountId} onChange={e=>setAccountId(e.target.value)} required pattern="[0-9]{12}" title="12 digits"/>
                <p className="hint">Enter your 12-digit AWS account ID</p>
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <button type="submit" className="btn btn-primary">Check Eligibility</button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="card-header"><h3>Migration Details</h3></div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Current Platform</label>
                <select value={form.currentPlatform} onChange={e=>setForm({...form,currentPlatform:e.target.value})} required>
                  <option value="">Select platform</option>
                  <option>Google Cloud Platform</option><option>Microsoft Azure</option><option>On-premises</option><option>Other Cloud</option>
                </select>
              </div>
              <div className="form-group"><label>Workload Description</label><textarea value={form.workloadDescription} onChange={e=>setForm({...form,workloadDescription:e.target.value})} required placeholder="Describe workloads to migrate"/></div>
              <div className="form-row">
                <div className="form-group"><label>Projected Annual AWS Spend ($)</label><input type="number" min="24000" max="500000" value={form.projectedArr} onChange={e=>setForm({...form,projectedArr:e.target.value})} required/></div>
                <div className="form-group"><label>Target Account ID</label><input type="text" value={form.targetAccountId} onChange={e=>setForm({...form,targetAccountId:e.target.value})} required/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Migration Start</label><input type="date" value={form.migrationStart} onChange={e=>setForm({...form,migrationStart:e.target.value})} required/></div>
                <div className="form-group"><label>Migration End</label><input type="date" value={form.migrationEnd} onChange={e=>setForm({...form,migrationEnd:e.target.value})} required/></div>
              </div>
              <div style={{marginBottom:'20px',display:'flex',flexDirection:'column',gap:'12px'}}>
                <label className="checkbox-group"><input type="checkbox" checked={form.isOpenaiMigration} onChange={e=>setForm({...form,isOpenaiMigration:e.target.checked})}/> Migrating from OpenAI / Azure OpenAI</label>
                <label className="checkbox-group"><input type="checkbox" checked={form.isGcpGeminiMigration} onChange={e=>setForm({...form,isGcpGeminiMigration:e.target.checked})}/> Migrating from GCP Gemini</label>
                <label className="checkbox-group"><input type="checkbox" checked={form.hasPartner} onChange={e=>setForm({...form,hasPartner:e.target.checked})}/> Working with a migration partner</label>
              </div>
              {form.hasPartner && <div className="form-group"><label>Partner Name</label><input type="text" value={form.partnerName} onChange={e=>setForm({...form,partnerName:e.target.value})}/></div>}
              <div style={{display:'flex',gap:'12px'}}><button type="button" className="btn btn-outline" onClick={()=>setStep(1)}>Back</button><button type="submit" className="btn btn-primary">Submit Application</button></div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div>
            {estimate && <div className="credit-estimate"><h3>Your Estimated Credit Range</h3><div className="amount">${estimate.minCredits.toLocaleString()} - ${estimate.maxCredits.toLocaleString()}</div><p style={{color:'#d5dbdb'}}>Based on {(estimate.baseRate*100)}% base + up to {(estimate.kickerRate*100)}% kicker on ${estimate.projectedArr.toLocaleString()} projected ARR</p><p className="disclaimer">Final amount subject to review.</p></div>}
            <div style={{textAlign:'center'}}><button className="btn btn-primary btn-lg" onClick={()=>setStep(4)}>Continue</button></div>
          </div>
        )}

        {step === 4 && (
          <div className="card" style={{textAlign:'center',padding:'40px'}}>
            {track === 'Express' ? (
              <><div className="confirmation-icon confirmation-icon-success"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div><h3>Application Approved!</h3><p style={{color:'#545b64',maxWidth:'500px',margin:'12px auto'}}>Credits will be disbursed within 5 business days. You will receive a welcome email with your IW Migrate Program Guide.</p><div className="alert alert-success" style={{justifyContent:'center',marginTop:'20px'}}><strong>Approved:</strong> Credits are on the way!</div></>
            ) : (
              <><div className="confirmation-icon confirmation-icon-pending"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div><h3>Application Submitted</h3><p style={{color:'#545b64',maxWidth:'500px',margin:'12px auto'}}>Your AWS account team will review and may reach out. Expected turnaround: 3-5 business days.</p><div className="alert alert-info" style={{justifyContent:'center',marginTop:'20px'}}><strong>Under Review:</strong> Your account team will be in touch shortly.</div></>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
