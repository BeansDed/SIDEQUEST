import { LockKeyhole, UserPlus, Users } from "lucide-react";

const activity = [
  { initials: "AY", name: "Aya", action: "saved Morrow Coffee", detail: "quiet reset", tone: "lavender" },
  { initials: "KN", name: "Ken", action: "finished a sidequest", detail: "+90 XP", tone: "sage" },
  { initials: "BE", name: "Bea", action: "shared a collection", detail: "late-night spots", tone: "roast" },
];

export function SocialScreen() {
  return <section className="consumer-screen social-screen"><header className="consumer-topline"><div><span className="consumer-kicker">FRIENDS ONLY</span><h1>Good plans start small.</h1></div><button className="round-action" aria-label="Add friend"><UserPlus size={19} /></button></header><div className="social-tabs"><button className="is-active">Activity</button><button>Friends · 12</button><button>Requests · 2</button></div><div className="activity-list">{activity.map((item) => <article key={item.name}><span className={`friend-avatar tone-${item.tone}`}>{item.initials}</span><div><h2>{item.name}</h2><p>{item.action}</p><small>{item.detail}</small></div></article>)}</div><div className="privacy-card"><LockKeyhole size={20} /><div><b>Your activity is friends-only</b><p>Exact location and active quests are always hidden.</p></div></div><button className="consumer-button is-secondary"><Users size={17} /> Find friends</button></section>;
}
