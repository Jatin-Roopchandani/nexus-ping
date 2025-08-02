import Link from 'next/link';
import Navbar from '../Navbar';

export default function ContactPage() {
  return (
    <div
      className="min-h-screen flex flex-col p-6 sm:p-12 font-[family-name:var(--font-geist-sans)] relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0d0c1d, #1f0036, #3a015c)",
      }}
    >
      <Navbar />
      <div className="max-w-5xl mx-auto py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Support</h2>
            <p className="font-semibold text-lg text-white mb-1">support@nexusping.com</p>
            <p className="text-white/80 mb-10">Please use your account e-mail address, we'll get back to you ASAP on a business day.</p>
            <h2 className="text-3xl font-bold mb-6 text-white">Community</h2>
            <p className="text-white/80">Join us on{' '}
              <Link href="https://discord.com/invite/uptimerobot" className="text-green-400 underline" target="_blank">Discord</Link>{' '}
              to get the latest news, participate in discussions, and have the chance to win prizes in various activities.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Cooperation</h2>
            <p className="font-semibold text-lg text-white mb-1">marketing@nexusping.com</p>
            <p className="text-white/80 mb-10">Reach out to us to explore how we can work together.</p>
            <h2 className="text-3xl font-bold mb-6 text-white">Feedback</h2>
            <p className="text-white/80">Help us shape the future of UptimeRobot by voting for feature suggestions or adding new ones on our community channels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
