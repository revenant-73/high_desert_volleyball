import { PageHeader } from "@/components/PageHeader";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Info, AlertTriangle } from "lucide-react";

export default function Rules() {
  const venues = [
    {
      name: "Rise Volleyball Academy",
      address: "719 N Principle Pl #110, Meridian, ID 83642",
      rules: [
        "Spectators: Bring your own chair.",
        "Spectators need to leave the gym when their team is not playing.",
        "Parking: Rear loading dock side preferred on Friday. Front/Back okay on Saturday.",
        "Food & Drink: Allowed inside, but kept off the courts."
      ]
    },
    {
      name: "Treasure Valley Athletic Center (TVAC)",
      address: "1251 E Piper Ct, Meridian, ID 83642",
      rules: [
        "Spectators: $5 gate fee. Bleachers available.",
        "Parking: Park ONLY in TVAC lot or on the road. Towed at owner expense otherwise."
      ]
    },
    {
      name: "Meridian Middle School",
      address: "1507 W 8th St, Meridian, ID 83642",
      rules: [
        "Spectators: Bring your own chair.",
        "Food & Drink: Only water allowed in the gyms."
      ]
    },
    {
      name: "Homedale Schools (HS & MS)",
      address: "203 E Idaho Ave / 3437 Johnstone Rd, Homedale, ID",
      rules: [
        "Spectators: Bleachers provided. $5 gate fee PER day.",
        "Players & Spectators: Must leave gym when not playing/officiating.",
        "Food & Drink: Only water allowed in the gyms."
      ]
    },
    {
      name: "Middleton Schools (HS & MS)",
      address: "200 S Piccadilly Ave / 1538 Emmett Rd, Middleton, ID",
      rules: [
        "Spectators: Bring your own chair.",
        "Food & Drink: Only water allowed in the gyms.",
        "MHS Note: Use EAST entrance only. No gathering in hallways."
      ]
    },
    {
      name: "The Forge International School",
      address: "208 S Hartley Ln, Middleton, ID 83644",
      rules: [
        "Spectators: TWO spectators per player. Bring your own chair.",
        "Players: Must leave gym when not playing/officiating.",
        "Food & Drink: Only water allowed in the gyms."
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <PageHeader 
        title="Site Rules & Regulations" 
        subtitle="These rules are set by each individual site and must be enforced to ensure continued access."
      />
      
      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 mb-12 flex gap-6 items-start">
          <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Important Notice</h3>
            <p className="text-amber-800 leading-relaxed text-sm">
              Questions about site regulations should be sent to your Club Director. HDVL enforces these rules to maintain our facility agreements.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {venues.map((venue, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-blue-50 p-3 rounded-2xl">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h2>
              <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                {venue.address}
              </p>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Info className="h-3 w-3" /> Facility Guidelines
                </h3>
                <ul className="space-y-3">
                  {venue.rules.map((rule, rIndex) => (
                    <li key={rIndex} className="text-sm text-gray-600 leading-relaxed pl-4 border-l-2 border-blue-100">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
