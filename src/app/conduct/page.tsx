import { PageHeader } from "@/components/PageHeader";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, XCircle, AlertCircle } from "lucide-react";

export default function Conduct() {
  const positives = [
    "I WILL abide by the official rules of USA Volleyball",
    "I WILL display good sportsmanship at all times",
    "I WILL encourage my child and his/her team, regardless of the outcome",
    "I WILL honor the rules of the host and the host facility",
    "I WILL generate goodwill by being polite and respectful",
    "I WILL direct my child to speak directly with his/her coach regarding decisions",
    "I WILL redirect any negative comments from others to the respective Site Director",
    "I WILL immediately notify the Site Director of any illegal activity",
    "I WILL model exemplary spectator behavior while attending this event"
  ];

  const negatives = [
    "I WILL NOT harass or intimidate the officials",
    "I WILL NOT coach my child from the bleachers and/or sidelines",
    "I WILL NOT criticize my child's coach or teammates",
    "I WILL NOT bring and/or carry any firearms at any event",
    "I WILL NOT bring, purchase, or consume alcohol at any event",
    "I WILL NOT bring any animals other than service animals"
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <PageHeader 
        title="Parent & Spectator Code of Conduct" 
        subtitle="Entry to any HDVL event is granted as a courtesy. Agreement to these guidelines is mandatory."
      />
      
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-50 p-3 rounded-2xl">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Expectations</h2>
            </div>
            <ul className="space-y-4">
              {positives.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-red-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-50 p-3 rounded-2xl">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Prohibited Actions</h2>
            </div>
            <ul className="space-y-4">
              {negatives.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-red-600 rounded-3xl p-8 text-white flex flex-col md:flex-row gap-8 items-center">
          <AlertCircle className="h-16 w-16 text-red-200 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold mb-2">Enforcement Notice</h3>
            <p className="text-red-100 leading-relaxed">
              Any violation of this code of conduct will result in you being asked to leave the event, and may result in a permanent ban from future HDVL events. The Site Director has the final say.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
