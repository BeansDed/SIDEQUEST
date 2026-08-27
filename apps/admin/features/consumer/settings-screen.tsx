"use client";

import { Bell, ChevronRight, Download, Eye, LocateFixed, LogOut, Shield, Trash2, UserX } from "lucide-react";
import Link from "next/link";

import { useConsumer } from "./consumer-store";

const rows = [
  { label: "Location & distance", note: "Makati · precise location off", icon: LocateFixed },
  { label: "Activity visibility", note: "Friends only", icon: Eye },
  { label: "Notifications", note: "Quest and save reminders", icon: Bell },
  { label: "Blocked users", note: "Manage safely", icon: UserX },
  { label: "Download my data", note: "Portable JSON export", icon: Download },
];

export function SettingsScreen() {
  const { resetDemo } = useConsumer();
  return <section className="consumer-screen settings-screen"><header className="consumer-topline"><div><span className="consumer-kicker">CONTROL YOUR DATA</span><h1>Settings & privacy</h1></div><Shield size={23} /></header><div className="settings-list">{rows.map(({ label, note, icon: Icon }) => <button key={label}><Icon size={18} /><span><b>{label}</b><small>{note}</small></span><ChevronRight size={17} /></button>)}</div><Link href="/app/plus" className="plus-entry"><span><b>SIDEQUEST Plus</b><small>Quest packs, group planning, offline saves</small></span><ChevronRight size={18} /></Link><button className="settings-danger"><Trash2 size={17} /><span>Delete account</span></button><button className="text-action" onClick={resetDemo}><LogOut size={15} /> Reset local demo data</button></section>;
}
