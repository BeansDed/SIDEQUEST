export default function OverviewPage() {
  return (
    <section className="overview-placeholder" aria-labelledby="overview-title">
      <div>
        <span className="eyebrow">WEDNESDAY, 27 AUGUST</span>
        <h1 id="overview-title">Good morning, Ardre.</h1>
        <p>The café network is ready for today’s service.</p>
      </div>
      <aside className="brew-note" aria-label="Daily operations note">
        <span>DAILY BREW</span>
        <strong>3 reports need a second look.</strong>
        <p>Oldest item has been waiting 42 minutes.</p>
      </aside>
    </section>
  );
}
