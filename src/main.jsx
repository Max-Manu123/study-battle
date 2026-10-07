import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './lib/supabase'
import { track } from './lib/analytics'
import './styles.css'

const goals = ['Mathematics', 'Coding', 'School exam', 'University exam', 'Other']
const timings = ['Less than 2 weeks', '2–4 weeks', '1–3 months', 'Later', 'No exam']
const competition = ['Definitely', 'Maybe', 'No']

function App() {
  const [form, setForm] = useState({
    goal: '',
    exam_timing: '',
    competition_interest: '',
    usefulness: '',
    email: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const scrollToBeta = () => {
    track('beta_cta_clicked')
    document.getElementById('beta')?.scrollIntoView({ behavior: 'smooth' })
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    track('beta_form_submitted_attempt')

    if (!supabase) {
      setError('The beta form is not connected yet. Add the Supabase environment variables and try again.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('beta_signups').insert({
      goal: form.goal,
      exam_timing: form.exam_timing,
      competition_interest: form.competition_interest,
      usefulness: form.usefulness.trim(),
      email: form.email.trim().toLowerCase(),
    })

    if (insertError) {
      setError('Something went wrong. Please try again in a moment.')
      setLoading(false)
      return
    }

    track('beta_form_submitted', {
      goal: form.goal,
      exam_timing: form.exam_timing,
      competition_interest: form.competition_interest,
    })
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main>
      <nav className="nav shell">
        <div className="brand"><span className="brand-mark">⚡</span> Study Battle</div>
        <button className="nav-cta" onClick={scrollToBeta}>Join the beta</button>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow">EARLY BETA · FREE</div>
          <h1>Turn studying into a <span>competition.</span></h1>
          <p className="hero-text">
            Prepare for exams with short challenges, compete with friends, earn XP,
            and see who improves the most.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={scrollToBeta}>Join the beta <span>→</span></button>
            <span className="micro">Free during the beta · No credit card required</span>
          </div>
          <div className="trust-row">
            <span>✓ Short challenges</span>
            <span>✓ Friend competition</span>
            <span>✓ AI-powered practice</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow" />
          <div className="battle-card">
            <div className="card-top">
              <span>WEEKLY BATTLE</span>
              <span className="live-dot">● LIVE</span>
            </div>
            <div className="leader"><b>1</b><span className="avatar a1">A</span><span>Alex</span><strong>1,240 XP</strong></div>
            <div className="leader"><b>2</b><span className="avatar a2">M</span><span>Maria</span><strong>1,180 XP</strong></div>
            <div className="leader you"><b>3</b><span className="avatar a3">Y</span><span>You</span><strong>1,050 XP</strong></div>
            <div className="overtake">⚡ 131 XP to overtake Maria</div>
          </div>
          <div className="readiness-card">
            <div className="readiness-head"><span>MATHEMATICS</span><strong>82%</strong></div>
            <div className="progress"><span style={{ width: '82%' }} /></div>
            <div className="skills">
              <span>Algebra <b>91%</b></span>
              <span>Functions <b>78%</b></span>
              <span>Geometry <b>74%</b></span>
              <span>Statistics <b>86%</b></span>
            </div>
          </div>
        </div>
      </section>

      <section className="problem shell">
        <div className="section-label">WHY THIS EXISTS</div>
        <h2>Studying alone gets boring.</h2>
        <p>Study Battle is designed to make exam preparation feel more like a game you actually want to come back to.</p>
        <div className="feature-grid">
          <Feature icon="🎯" title="Personalized challenges" text="Practice the topics you actually need to improve." />
          <Feature icon="⚔️" title="Battle your friends" text="Turn a study session into a friendly competition." />
          <Feature icon="🏆" title="XP & leaderboards" text="Make progress visible and give yourself something to beat." />
          <Feature icon="🤖" title="AI-powered practice" text="Generate practice around your goals and weak spots." />
        </div>
      </section>

      <section className="beta shell" id="beta">
        <div className="beta-intro">
          <div className="section-label">HELP US BUILD IT</div>
          <h2>Want to be one of the first?</h2>
          <p>Tell us what you're preparing for. We're looking for a small group of students to shape the first version.</p>
        </div>

        {submitted ? (
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h3>You're on the list!</h3>
            <p>We'll contact you when the beta is ready.</p>
          </div>
        ) : (
          <form className="beta-form" onSubmit={submit}>
            <Field label="What are you preparing for?">
              <select required value={form.goal} onChange={(e) => update('goal', e.target.value)}>
                <option value="">Choose one</option>
                {goals.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="When is your exam?">
              <select required value={form.exam_timing} onChange={(e) => update('exam_timing', e.target.value)}>
                <option value="">Choose one</option>
                {timings.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Would you want to compete with friends?">
              <select required value={form.competition_interest} onChange={(e) => update('competition_interest', e.target.value)}>
                <option value="">Choose one</option>
                {competition.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="What would make this useful for you?">
              <textarea required rows="3" placeholder="e.g. I want to practice math with my friends..." value={form.usefulness} onChange={(e) => update('usefulness', e.target.value)} />
            </Field>
            <Field label="Email">
              <input required type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </Field>
            {error && <p className="form-error">{error}</p>}
            <button className="primary full" disabled={loading}>{loading ? 'Joining...' : 'Join the beta →'}</button>
            <p className="form-note">No spam. We'll only use your email for the beta.</p>
          </form>
        )}
      </section>

      <footer className="footer shell">
        <div>⚡ Study Battle</div>
        <span>Concept / early beta</span>
      </footer>
    </main>
  )
}

function Feature({ icon, title, text }) {
  return <article className="feature"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>
}

createRoot(document.getElementById('root')).render(<App />)