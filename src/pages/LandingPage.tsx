import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="hero-eyebrow">AWS Startups</div>
              <h1>Migrate to AWS.<br/>Get Credits.</h1>
              <p>Accelerate your cloud migration with AWS Incremental Workloads Migrate credits. Apply in minutes, get a decision fast.</p>
              <div className="hero-actions">
                <Link to="/apply" className="btn btn-primary btn-lg">Apply for Credits</Link>
                <a href="#how-it-works" className="btn btn-ghost">Learn More</a>
              </div>
            </div>
            <div className="hero-visual">
              <svg viewBox="0 0 500 400" fill="none" style={{width:'100%',height:'auto'}}>
                <rect width="500" height="400" rx="16" fill="#1a2538"/>
                <ellipse cx="250" cy="180" rx="120" ry="70" fill="#2d3a4e"/>
                <ellipse cx="180" cy="200" rx="80" ry="55" fill="#2d3a4e"/>
                <ellipse cx="320" cy="200" rx="80" ry="55" fill="#2d3a4e"/>
                <rect x="210" y="150" width="80" height="50" rx="8" fill="#ff9900" opacity="0.9"/>
                <text x="250" y="182" textAnchor="middle" fill="#232f3e" fontSize="18" fontWeight="700" fontFamily="sans-serif">AWS</text>
                <rect x="100" y="270" width="60" height="80" rx="6" fill="#37475a"/>
                <rect x="110" y="280" width="40" height="8" rx="2" fill="#4a90d9" opacity="0.7"/>
                <rect x="110" y="295" width="40" height="8" rx="2" fill="#4a90d9" opacity="0.5"/>
                <rect x="110" y="310" width="40" height="8" rx="2" fill="#4a90d9" opacity="0.3"/>
                <path d="M165 290 L200 220" stroke="#ff9900" strokeWidth="3" strokeDasharray="6 4"/>
                <ellipse cx="370" cy="290" rx="35" ry="12" fill="#37475a"/>
                <rect x="335" y="290" width="70" height="40" fill="#37475a"/>
                <ellipse cx="370" cy="330" rx="35" ry="12" fill="#37475a"/>
                <path d="M355 280 L300 220" stroke="#ff9900" strokeWidth="3" strokeDasharray="6 4"/>
                <rect x="180" y="360" width="140" height="30" rx="15" fill="#ff9900"/>
                <text x="250" y="380" textAnchor="middle" fill="#232f3e" fontSize="12" fontWeight="700" fontFamily="sans-serif">MIGRATION CREDITS</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-bar">
        <div className="container">
          <div className="trust-content">
            <span className="trust-label">Trusted by startups migrating from</span>
            <div className="trust-logos">
              <span className="trust-logo-text">Azure</span>
              <span className="trust-divider"></span>
              <span className="trust-logo-text">Google Cloud</span>
              <span className="trust-divider"></span>
              <span className="trust-logo-text">On-Premises</span>
              <span className="trust-divider"></span>
              <span className="trust-logo-text">OpenAI</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to get migration credits for your workloads</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
              <div className="step-number-badge">1</div>
              <h3>Check Eligibility</h3>
              <p>Instant eligibility verification based on your account profile.</p>
            </div>
            <div className="step-card">
              <div className="step-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
              <div className="step-number-badge">2</div>
              <h3>Submit Application</h3>
              <p>Tell us about your migration: platform, workloads, timeline, and projected spend. Takes 5 minutes.</p>
            </div>
            <div className="step-card">
              <div className="step-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
              <div className="step-number-badge">3</div>
              <h3>Get Credits</h3>
              <p>Receive an instant credit estimate. Smaller workloads may qualify for auto-approval.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2>Program Details</h2>
          </div>
          <div className="details-grid">
            <div className="detail-card">
              <h4>Eligible ARR Range</h4>
              <p className="detail-value">$24,000 - $500,000</p>
              <p className="detail-desc">Annual recurring revenue on AWS</p>
            </div>
            <div className="detail-card">
              <h4>Credit Rate</h4>
              <p className="detail-value">Up to 25% of 1st year spend</p>
              <p className="detail-desc">Of projected first-year AWS spend</p>
            </div>
            <div className="detail-card">
              <h4>Fast Track</h4>
              <p className="detail-value">Auto-approval available</p>
              <p className="detail-desc">For smaller qualifying workloads</p>
            </div>
            <div className="detail-card">
              <h4>Competitive Kicker</h4>
              <p className="detail-value">+10% for AI migrations</p>
              <p className="detail-desc">Moving from OpenAI or Gemini</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to migrate?</h2>
            <p>Check your eligibility and get a credit estimate in under 5 minutes.</p>
            <Link to="/apply" className="btn btn-primary btn-lg">Start Your Application</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
