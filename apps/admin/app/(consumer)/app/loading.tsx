export default function ConsumerLoading() {
  return <section className="consumer-screen consumer-loading" aria-label="Loading cafés"><span className="consumer-kicker">FINDING YOUR VIBE</span>{[1, 2, 3].map((item) => <div className="consumer-skeleton" key={item}><i /><span><b /><b /><b /></span></div>)}</section>;
}
