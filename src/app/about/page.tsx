
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Target, BookOpen, CheckCircle } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    { name: "Chandrakant Shinde", role: "President", imageUrl: "https://placehold.co/300x300.png", dataAiHint: "professional portrait" },
    { name: "Sangam Patil", role: "Vice President", imageUrl: "https://placehold.co/300x300.png", dataAiHint: "person smiling" },
    { name: "Deepak Gawas", role: "Secretary", imageUrl: "https://placehold.co/300x300.png", dataAiHint: "professional headshot" },
    { name: "Ramesh Zarmekar", role: "Treasurer", imageUrl: "https://placehold.co/300x300.png", dataAiHint: "person portrait" },
    { name: "Sanket Naik", role: "EC Member", imageUrl: "https://placehold.co/300x300.png", dataAiHint: "team member" },
    { name: "Subodh Naik", role: "EC Member", imageUrl: "https://placehold.co/300x300.png", dataAiHint: "professional photo" },
    { name: "Vitthal Shelke", role: "EC Member", imageUrl: "https://placehold.co/300x300.png", dataAiHint: "person smiling" },
    { name: "Suryakant Gaonkar", role: "EC Member", imageUrl: "https://placehold.co/300x300.png", dataAiHint: "professional headshot" },
    { name: "Gajanan Shetye", role: "EC Member", imageUrl: "https://placehold.co/300x300.png", dataAiHint: "team member" },
  ];

  const missionPoints = [
    "Protecting & improving the natural environment.",
    "Spreading awareness and knowledge on the principles, practices regarding wildlife protection, pollution control and conservation of natural resources.",
    "Facilitating action to maintain the stock of biological wealth.",
    "To carry out environmental education and reach to a maximum people.",
    "To rescue, treat & rehabilitate wild animals.",
    "To implement conservation projects, coordinate related activities and spread awareness regarding the same.",
    "To carry out research & documentation on wildlife and other facets of biodiversity."
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <Leaf size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">About VEAB Goa</h1>
        <p className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
          Vivekanand Environment Awareness Brigade (VEAB) is a non-profit organization based in Keri- Sattari- Goa, dedicated towards environment education & wildlife conservation.
        </p>
      </header>

      <section className="mb-16">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
              <BookOpen size={32} className="text-accent mr-3" />
              <CardTitle className="text-3xl text-accent">Our Story</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-lg text-foreground space-y-4">
            <p>
              Founded in 2010 by a group of passionate environmentalists and local community leaders, VEAB Goa emerged from a shared concern for the rapidly changing Goan landscape. Witnessing the pressures of unplanned development, resource depletion, and climate change on our pristine ecosystems, we felt an urgent call to action.
            </p>
            <p>
              Over the past decade, VEAB Goa has grown from a small volunteer group into a recognized organization at the forefront of environmental conservation in the region. Our journey has been marked by successful grassroots campaigns, impactful research projects, and a growing network of dedicated volunteers and partners. We believe in a collaborative approach, working closely with local communities, government bodies, and academic institutions to create lasting positive change.
            </p>
             <Image src="https://placehold.co/800x400.png" alt="VEAB Goa team working" width={800} height={400} className="rounded-lg mt-6" data-ai-hint="team environment"/>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16 grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
             <div className="flex items-center mb-2">
                <Target size={32} className="text-accent mr-3" />
                <CardTitle className="text-3xl text-accent">Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-lg text-foreground">
            <ul className="space-y-3">
              {missionPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
                <Leaf size={32} className="text-accent mr-3" /> {/* Using Leaf as a stand-in for vision icon */}
                <CardTitle className="text-3xl text-accent">Our Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-lg text-foreground">
            <p>
              We envision a Goa where human development and environmental preservation coexist harmoniously. A future where our rich biodiversity thrives, our natural resources are managed sustainably, and communities are environmentally conscious and resilient.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="text-center mb-10">
          <Users size={48} className="mx-auto text-primary mb-3" />
          <h2 className="text-3xl md:text-4xl font-semibold text-primary">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground mt-1">The driving force behind our conservation efforts.</p>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4 border-4 border-primary/40"
                  data-ai-hint={member.dataAiHint}
                />
                <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                <p className="text-accent">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center mt-8 text-lg text-foreground">
            And many more dedicated volunteers and supporters who make our work possible!
        </p>
      </section>
    </div>
  );
}
