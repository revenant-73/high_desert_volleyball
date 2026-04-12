import { PageHeader } from "@/components/PageHeader";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2, Layout, Users, Send } from "lucide-react";

export default function RegisterGuide() {
  const steps = [
    {
      title: "Create an Account on TM2Sign.com",
      icon: Layout,
      details: [
        "Create a club on TM2Sign.com",
        "CLUB NAME: Full name of your club (ex. Rise Volleyball Academy)",
        "CLUB ALIAS: Short name for your club (ex. Rise)",
        "Check the box to allow the system to use your CLUB ALIAS when creating team names."
      ]
    },
    {
      title: "Create Your Team(s)",
      icon: Users,
      details: [
        "Under the 'teams' tab, click 'Add Team'",
        "Team Name: Just the specific team name (ex. 18 Steve). Club name is added automatically.",
        "Gender: Female, Male, or Co-ed (if mixed).",
        "Type: Juniors",
        "Age group: Age of the OLDEST player as of June 30, 2023",
        "Team Rank: Your internal ranking if you have multiple teams in an age group."
      ]
    },
    {
      title: "Register for the HDVL Event",
      icon: Send,
      details: [
        "Click on the 'Enter Events' tab",
        "Type 'HDVL' into the search box",
        "Click the GREEN 'Register' button on the far right",
        "Select a division that meets your team's age requirements",
        "Click 'Submit Pending Registrations'"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <PageHeader 
        title="Registration Guide" 
        subtitle="Follow these steps to register your team(s) for HDVL events on TM2Sign."
      />
      
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                </div>
                <ul className="space-y-3">
                  {step.details.map((detail, dIndex) => (
                    <li key={dIndex} className="flex gap-3 text-gray-600">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-600 rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Register?</h3>
          <p className="mb-8 text-blue-100">Head over to TM2Sign to get your teams started.</p>
          <a 
            href="https://tm2sign.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors"
          >
            Visit TM2Sign.com
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
