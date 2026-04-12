import { Shield, Target, Award, Users } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "JVA Sanctioned",
      description: "HDVL is the only JVA sanctioned league in Southern Idaho, ensuring a high level of coaching education and player safety.",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Open Affiliation",
      description: "Whether your team is USAV, AAU, or independent, all are welcome to participate in our events.",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Athlete Centered",
      description: "A league designed to fit your team's competitive level, from 12u to 18u.",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Professional Standards",
      description: "Ensuring top-tier officiating and high safety standards for all participants.",
      icon: Award,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Why Choose the High Desert <br />
              <span className="text-blue-600">Volleyball League?</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Created in 2018, our mission is to provide quality local volleyball tournaments in the Treasure Valley. We pride ourselves on creating a competitively beneficial experience for all levels.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className={`${feature.bgColor} p-3 rounded-lg h-fit`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-snug">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-blue-600 aspect-video rounded-3xl overflow-hidden shadow-2xl relative z-10">
                {/* Image placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                    <p className="text-white font-medium italic text-lg">&quot;Excellence in every serve, every set, every spike.&quot;</p>
                </div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 rounded-full -z-0" />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gray-100 rounded-full -z-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
