import { Shield, Target, Award, Users } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/data/site-config";

export function Features() {
  const features = [
    {
      title: "JVA Sanctioned",
      description: "HDVL is the only JVA sanctioned league in Southern Idaho, ensuring a high level of coaching education and player safety.",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      logo: "/jva-logo.png",
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
    <section id="about" className="py-24 bg-white overflow-hidden">
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
                <div key={feature.title} className="flex flex-col gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`${feature.bgColor} p-3 rounded-lg h-fit`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 leading-snug">{feature.description}</p>
                    {feature.logo && (
                      <Image 
                        src={`${feature.logo}`} 
                        alt="Feature Logo" 
                        width={100} 
                        height={40} 
                        className="h-10 w-auto object-contain"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-blue-600 aspect-video rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <Image 
                  src="/team_photo.jpg" 
                  alt="HDVL Team" 
                  fill
                  className="object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <p className="text-white font-medium italic text-lg relative z-10">&quot;Excellence in every serve, every set, every spike.&quot;</p>
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full -z-0" />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-gray-50 rounded-full -z-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
