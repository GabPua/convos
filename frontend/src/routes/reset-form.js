export default function ResetForm() {
  return (
    <div className="min-h-screen relative">
      <div className="h-[60vh] bg-primary">
        <div></div>
      </div>
      <div className="absolute left-1/2 top-1/2 shadow-2xl bg-secondary -translate-x-1/2 -translate-y-1/2">
        <h1 className="weight-bold">Reset your password</h1>
        <div className="field">
          <input className="input" placeholder="Email" />
        </div>
        <button className="btn primary">Send Email</button>
      </div>
    </div>
  )
}