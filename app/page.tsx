import SequenceScroll from '@/components/SequenceScroll';

export default function Home() {
  return (
    <main>
      <SequenceScroll />
      
      <section className="max-w-4xl mx-auto py-20 px-6">
        <h2 className="text-4xl font-bold mb-10">Featured Projects</h2>
        <div className="grid gap-8">
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold">Aadhar Fraud Detection</h3>
            <p className="text-white/60 mt-2">AI-based system using OCR and anomaly detection.</p>
          </div>
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold">NASA Space Apps</h3>
            <p className="text-white/60 mt-2">Global Nominee for innovative problem solving.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
