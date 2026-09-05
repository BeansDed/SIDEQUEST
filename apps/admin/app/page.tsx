import {
  ArrowDown,
  CheckCircle2,
  CircleHelp,
  Coffee,
  Compass,
  Download,
  LockKeyhole,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { RecommendationPassport, type LandingRecommendation } from "@/components/landing/recommendation-passport";
import { getApkRelease } from "@/lib/apk-release";

import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: "SIDEQUEST — Find the café for right now",
  description: "Choose a café by mood, purpose, budget, and the small adventure you want today.",
};

const recommendations: LandingRecommendation[] = [
  { id: "quiet", label: "Quiet", cafe: "Soft Hours", neighborhood: "Legazpi Village", detail: "Warm light, low voices, wide tables, and enough calm to hear your own thoughts.", quest: "Leave your phone face-down for the first ten minutes.", meta: "8 MIN WALK · ₱220 AVG", accent: "blue" },
  { id: "creative", label: "Creative", cafe: "Draft & Drip", neighborhood: "Poblacion", detail: "A lively counter, rotating local art, and the productive hum of people making things.", quest: "Make one tiny thing before your drink gets cold.", meta: "11 MIN WALK · ₱190 AVG", accent: "mango" },
  { id: "date", label: "Date", cafe: "Glasshouse Coffee", neighborhood: "Salcedo Village", detail: "Garden edges, flattering afternoon light, and seats that invite one more conversation.", quest: "Order something neither of you has tried before.", meta: "14 MIN WALK · ₱310 AVG", accent: "green" },
  { id: "quick", label: "Quick", cafe: "Corner Run", neighborhood: "Ayala Triangle", detail: "Fast service, excellent espresso, and a clean route back to wherever the day needs you.", quest: "Take the long block home and notice one new detail.", meta: "4 MIN WALK · ₱160 AVG", accent: "ink" },
];


const faqs = [
  ["Why is this an APK?", "This is a direct Android development release for testing before a store launch. Android may ask you to allow installation from your browser."],
  ["Does it need my location?", "No. Location improves nearby results, but declining it keeps the bundled café guide available."],
  ["Where is my data stored?", "This build keeps preferences, saves, visit activity, reviews, and quest progress on your device. Cloud sync is not connected yet."],
  ["Is this production-signed?", "No. The current package is development-signed for direct testing. A store release requires a separate protected production certificate."],
];

export default async function HomePage() {
  const release = await getApkRelease();

  return (
    <main className={styles.landing}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}><Navigation size={18} strokeWidth={2.6} /></span>
          <span><strong>SIDEQUEST</strong><small>CAFÉ FIELD GUIDE</small></span>
        </Link>
        <div className={styles.navActions}>
          <a className={styles.navJump} href="#how-it-works">How it works</a>
          <Link className={styles.staffLink} href="/login"><LockKeyhole size={16} /> Staff login</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Your café guide · Metro Manila</p>
          <h1>Find a café for <em>your kind of day.</em></h1>
          <p className={styles.intro}>Skip the endless list. Choose the mood, see what matters before you leave, and take a small sidequest with you.</p>
          <div className={styles.heroActions}>
            {release ? <a className={styles.downloadButton} href={release.downloadPath} download><Download size={20} /> Download SIDEQUEST for Android</a> : <span className={styles.pendingBuild}><Coffee size={19} /> Android build is being prepared.</span>}
            <a className={styles.textAction} href="#passport">Try the café matcher <ArrowDown size={17} /></a>
          </div>
          {release ? <p className={styles.releaseLine}><CheckCircle2 size={15} /> Version {release.version} · {release.sizeLabel} · verified file</p> : null}
        </div>
        <figure className={styles.heroPhoto}>
          <Image src="/cafes/soft-hours.jpg" alt="A café interior from the SIDEQUEST guide" width={640} height={480} sizes="(max-width: 760px) 100vw, 45vw" priority />
          <figcaption>Find a place to focus, catch up, or take a break.</figcaption>
        </figure>
      </section>

      <section className={styles.passportSection} id="passport">
        <RecommendationPassport recommendations={recommendations} />
      </section>

      <section className={styles.walkthrough} id="how-it-works" aria-labelledby="walkthrough-title">
        <div className={styles.sectionLead}>
          <p className={styles.eyebrow}>In the app</p>
          <h2 id="walkthrough-title">What the app actually does.</h2>
        </div>
        <div className={styles.journey}>
          <article><span className={styles.journeyMarker}><Sparkles size={21} /></span><small>BEFORE</small><h3>Say what today needs.</h3><p>Quiet focus, a proper catch-up, a low-key date, or a fast coffee between plans.</p></article>
          <article><span className={styles.journeyMarker}><MapPin size={21} /></span><small>DECIDE</small><h3>See the useful details.</h3><p>Walking time, price, open status, rating, atmosphere, amenities, and what the café works for.</p></article>
          <article><span className={styles.journeyMarker}><Compass size={21} /></span><small>GO</small><h3>Take a sidequest.</h3><p>Choose one small prompt, make the visit memorable, and keep the result in your own café history.</p></article>
        </div>
      </section>

      <section className={styles.releaseSection} aria-labelledby="android-release">
        <div className={styles.releaseCopy}>
          <p className={styles.eyebrow}>Android test release</p>
          <h2 id="android-release">Put the guide in your pocket.</h2>
          <p>The customer experience lives in the Android app. This site is the official download point and the doorway to staff administration.</p>
          <div className={styles.assurances}><span><ShieldCheck size={17} /> Checksum shown</span><span><CheckCircle2 size={17} /> Direct file</span><span><WifiOff size={17} /> Local-first</span></div>
        </div>
        <div className={styles.releaseCard}>
          {release ? <>
            <div className={styles.releaseStatus}><CheckCircle2 size={18} /> Verified development build</div>
            <dl><div><dt>Version</dt><dd>{release.version}</dd></div><div><dt>File size</dt><dd>{release.sizeLabel}</dd></div><div><dt>SHA-256</dt><dd className={styles.hash}>{release.sha256}</dd></div></dl>
            <p>Signed for direct device testing. A production store release uses a separate protected certificate.</p>
            <a className={styles.secondaryDownload} href={release.downloadPath} download><Download size={18} /> Download for Android</a>
          </> : <><div className={styles.releaseStatus}><Coffee size={18} /> Build unavailable</div><p>The verified Android package has not been published yet. No placeholder or unverified file will be offered.</p></>}
        </div>

      <div className={styles.faq} aria-labelledby="faq-title">
        <div><p className={styles.eyebrow}>Before you install</p><h2 id="faq-title">Straight answers.</h2><p>Development builds should be clear about what is real and what still needs production services.</p></div>
        <div className={styles.faqList}>{faqs.map(([question, answer]) => <details key={question}><summary><CircleHelp size={18} /> {question}</summary><p>{answer}</p></details>)}</div>
      </div>
      </section>

      <footer className={styles.footer}>
        <Link className={styles.brand} href="/"><span className={styles.brandMark}><Navigation size={18} /></span><span><strong>SIDEQUEST</strong><small>CAFÉ FIELD GUIDE</small></span></Link>
        <span>Made for coffee runs with a little more story.</span>
        <Link href="/login">Staff administration</Link>
      </footer>
    </main>
  );
}
