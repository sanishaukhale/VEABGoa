
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, Users, Target, BookOpen, CheckCircle, Linkedin, Twitter, Mail as MailIcon, ShieldCheck, ListChecks, Eye, Award, Users2 } from "lucide-react";
import { useState, useEffect } from "react";
import { storage } from '@/lib/firebase';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ElementType;
}

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string; 
  dataAiHint?: string;
  intro: string;
  profession: string;
  socials?: SocialLink[];
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function AboutPage() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [resolvedImageUrls, setResolvedImageUrls] = useState<Record<string, string>>({});
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const teamMembers: TeamMember[] = [
    {
      name: "Chandrakant Shinde",
      role: "President",
      imageUrl: "team-images/chandrakant_shinde.png", 
      intro: "Leading VEAB with a dedicated vision for Goa's environmental conservation and community engagement.",
      profession: "Environmental Leader",
      socials: [
        { platform: "LinkedIn", url: "#", icon: Linkedin },
        { platform: "Mail", url: "mailto:president@example.com", icon: MailIcon },
      ],
    },
    {
      name: "Sangam Patil",
      role: "Vice President",
      imageUrl: "team-images/sangam_patil.jpg", 
      dataAiHint: "person smiling",
      intro: "Supporting strategic initiatives and fostering partnerships for sustainable development in the region.",
      profession: "Conservation Strategist",
      socials: [{ platform: "Twitter", url: "#", icon: Twitter }],
    },
    {
      name: "Deepak Gawas",
      role: "Secretary",
      imageUrl: "team-images/deepak_gawas.png", 
      dataAiHint: "professional headshot",
      intro: "Overseeing administrative operations and ensuring smooth execution of VEAB's projects and programs.",
      profession: "Operations Manager",
      socials: [{ platform: "Mail", url: "mailto:secretary@example.com", icon: MailIcon }],
    },
    {
      name: "Ramesh Zarmekar",
      role: "Treasurer",
      imageUrl: "team-images/ramesh_zarmekar.png", 
      dataAiHint: "person portrait",
      intro: "Managing financial resources with transparency to support VEAB's mission and long-term sustainability.",
      profession: "Financial Advisor",
    },
    {
      name: "Sanket Naik",
      role: "EC Member",
      imageUrl: "https://placehold.co/300x300.png", 
      dataAiHint: "team member",
      intro: "Contributing to ecological research and on-ground conservation activities with expertise.",
      profession: "Field Biologist",
    },
    {
      name: "Subodh Naik",
      role: "EC Member",
      imageUrl: "https://placehold.co/300x300.png", 
      dataAiHint: "professional photo",
      intro: "Actively involved in community outreach and environmental awareness campaigns across Goa.",
      profession: "Community Organizer",
    },
    {
      name: "Vitthal Shelke",
      role: "EC Member",
      imageUrl: "https://placehold.co/300x300.png", 
      dataAiHint: "person smiling",
      intro: "Focused on wildlife rescue operations and habitat restoration projects within the state.",
      profession: "Wildlife Rehabilitator",
    },
    {
      name: "Suryakant Gaonkar",
      role: "EC Member",
      imageUrl: "https://placehold.co/300x300.png", 
      dataAiHint: "professional headshot",
      intro: "Dedicated to promoting sustainable agricultural practices and local biodiversity.",
      profession: "Agroecologist",
    },
    {
      name: "Gajanan Shetye",
      role: "EC Member",
      imageUrl: "https://placehold.co/300x300.png", 
      dataAiHint: "team member",
      intro: "Advocating for policy changes and legal frameworks for better environmental protection.",
      profession: "Environmental Advocate",
    },
  ];

  useEffect(() => {
    const fetchImageUrls = async () => {
      setIsLoadingImages(true);
      const urls: Record<string, string> = {};
      for (const member of teamMembers) {
        if (member.imageUrl && !member.imageUrl.startsWith('https://') && !member.imageUrl.startsWith('/')) {
          if (storage) {
            try {
              const imageRef = storageRef(storage, member.imageUrl);
              const downloadUrl = await getDownloadURL(imageRef);
              urls[member.name] = downloadUrl;
            } catch (error) {
              console.error(`Failed to get download URL for ${member.name} (${member.imageUrl}):`, error);
              urls[member.name] = `https://placehold.co/128x128.png?text=Img+NF`; // Updated placeholder
            }
          } else {
            console.warn("Firebase Storage not available for member:", member.name);
            urls[member.name] = `https://placehold.co/128x128.png?text=No+Storage`; 
          }
        } else {
          urls[member.name] = member.imageUrl.startsWith('/') 
            ? `${basePath}${member.imageUrl}` 
            : (member.imageUrl || `https://placehold.co/128x128.png?text=No+Image`);
        }
      }
      setResolvedImageUrls(urls);
      setIsLoadingImages(false);
    };

    fetchImageUrls();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  const valuesList = [
    "Protecting & improving the natural environment.",
    "Spreading awareness and knowledge on the principles, practices regarding wildlife protection, pollution control and natural resource conservation.",
    "Maintaining the stock of biological wealth."
  ];

  const objectivesList = [
    "To carry out Environment education.",
    "To implement various conservation projects, coordinate related activities and spread awareness regarding the same.",
    "To rescue, treat & rehabilitate wild animals.",
    "To carry out documentation and research on wildlife and other facets of biodiversity."
  ];

  const handleFlip = (name: string) => {
    setFlippedCards(prevFlippedCards => {
      if (prevFlippedCards[name]) {
        return {}; 
      }
      const newFlippedState: Record<string, boolean> = {};
      newFlippedState[name] = true;
      return newFlippedState;
    });
  };


  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <Leaf size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">About VEAB Goa</h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Vivekanand Environment Awareness Brigade (VEAB) is a non-profit organization based at Keri, Sattari-Goa, dedicated towards environment education and wildlife conservation. Registered on October 04, 2001 under the Societies Registration Act, 1860, VEAB has gained repute as a leading force in the field of environment conservation.
        </p>
      </header>

      <section className="mb-12 md:mb-16">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
              <BookOpen size={32} className="text-accent mr-3" />
              <CardTitle className="text-2xl sm:text-3xl text-accent">Our Story</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-base sm:text-lg text-foreground space-y-4">
            <p>
              Primarily comprising of youth from various walks of life, Vivekanand Environment Awareness Brigade (VEAB) is a symbol of transformation and channelization of the energy in the youth in the right direction. Founded in 2001 by a group of passionate environmentalists and local community leaders, VEAB Goa emerged from a shared concern for the rapidly changing Goan landscape. Witnessing the pressures of unplanned development, resource depletion, and climate change on our pristine ecosystems, we felt an urgent call to action.
            </p>
            <p>
              Over the past two decades, VEAB Goa has grown from a small volunteer group into a recognized organization at the forefront of environmental conservation in the region. Our journey has been marked by successful grassroots campaigns, impactful research projects, and a growing network of dedicated volunteers and partners. VEAB has been recognized as a key Environment NGO by the Dr. Jane Goodall Institute and was awarded the prestigious state “Paryavaran Rakshak Puraskar” in the year 2017. We believe in a collaborative approach, working closely with local communities, government bodies, and academic institutions to create lasting positive change.
            </p>
             <Image
                src={`${basePath}/veab-our-story.jpg`}
                alt="VEAB Goa team collaborating on environmental projects"
                width={800}
                height={400}
                className="rounded-lg mt-6 mx-auto w-full h-auto"
                data-ai-hint="team collaboration"
             />
          </CardContent>
        </Card>
      </section>

      <section className="mb-12 md:mb-16">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
              <Target size={32} className="text-accent mr-3" />
              <CardTitle className="text-2xl sm:text-3xl text-accent">Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-base sm:text-lg text-foreground space-y-4">
            <p>
              Through a comprehensive set of activities, VEAB introduces people to the amazing World of nature and empowers them to be environmental defenders. The organisation routinely conducts nature orientation camps for schools and the general public. Kids and adults are taken to the forests in Goa where they spend time learning about wildlife, its importance and how they can help protect it. Nature trails and birding trips are held regularly and participants visit gardens and nearby forests where they guided by resource people and learn how to observe wild animals. A key tool used by VEAB to spread their message is street play. One of VEAB’s major programme is wildlife rescue.
            </p>
            <p>
              Adventure activities like rock climbing, trekking are also organized for the public. Cycle Rallies are also organized for awareness of issues demanding urgent attention.
            </p>
            <p>
              It has been realized over the years that wildlife conservation cannot be a reality without participation of the people. Our aim for the future therefore, is to implement action based wildlife conservation projects in Goa and surrounding areas with the people&apos;s participation.
            </p>
            <p>
              Our Mission is to protect and improve Goa&apos;s natural environment including forests, lakes, rivers and wildlife, to aid and spread awareness and knowledge on principles, practices, techniques and methods regarding wildlife protection, eco-development, pollution control, social forestry and natural resource conservation; to assist the state forest department or any other statutory body or authority operating in the field of conservation; to put an end to hunting; protecting endangered species; to organize rock-climbing and trekking with emphasis on forest exploration, nature-study, wilderness survival, rescue operations and life-saving; organizing nature-study, nature awareness camps and scientific explorations and adventures to camp sites, etc.
            </p>
          </CardContent>
        </Card>
      </section>

       <section className="mb-12 md:mb-16">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
                <Eye size={32} className="text-accent mr-3" />
                <CardTitle className="text-2xl sm:text-3xl text-accent">Our Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-base sm:text-lg text-foreground">
            <p>
              We envision a Goa where human development and environmental preservation coexist harmoniously. A future where our rich biodiversity thrives, our natural resources are managed sustainably, and communities are environmentally conscious and resilient.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12 md:mb-16 grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
             <div className="flex items-center mb-2">
                <ShieldCheck size={32} className="text-accent mr-3" />
                <CardTitle className="text-2xl sm:text-3xl text-accent">Our Values</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-base sm:text-lg text-foreground">
            <ul className="space-y-3">
              {valuesList.map((point, index) => (
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
                <ListChecks size={32} className="text-accent mr-3" />
                <CardTitle className="text-2xl sm:text-3xl text-accent">Our Objectives</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-base sm:text-lg text-foreground">
             <ul className="space-y-3">
              {objectivesList.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-12 md:mb-16">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
              <Users2 size={32} className="text-accent mr-3" />
              <CardTitle className="text-2xl sm:text-3xl text-accent">Our Foundation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-base sm:text-lg text-foreground space-y-4">
              <p>Primarily comprising of youth from various walks of life, Vivekanand Environment Awareness Brigade (VEAB) is a symbol of transformation and channelization of the energy in the youth in the right direction.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12 md:mb-16">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center mb-2">
              <Award size={32} className="text-accent mr-3" />
              <CardTitle className="text-2xl sm:text-3xl text-accent">Recognitions & Awards</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-base sm:text-lg text-foreground space-y-3">
              <p className="flex items-start">
                <CheckCircle size={20} className="text-primary mr-2 mt-1 flex-shrink-0" />
                <span>Recognized as a key Environment NGO by the Dr. Jane Goodall Institute.</span>
              </p>
              <p className="flex items-start">
                <CheckCircle size={20} className="text-primary mr-2 mt-1 flex-shrink-0" />
                <span>Awarded the prestigious state “Paryavaran Rakshak Puraskar” in the year 2017.</span>
              </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="text-center mb-10">
          <Users size={48} className="mx-auto text-primary mb-3" />
          <h2 className="text-3xl md:text-4xl font-semibold text-primary">Meet Our Team</h2>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="flip-card h-96" onClick={() => handleFlip(member.name)}>
              <div className={`flip-card-inner ${flippedCards[member.name] ? 'is-flipped' : ''}`}>
                <div className="flip-card-front">
                  <Card className="w-full h-full flex flex-col text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="pt-6 flex flex-col items-center justify-center flex-grow">
                      {isLoadingImages || !resolvedImageUrls[member.name] ? (
                        <Skeleton className="rounded-full mx-auto mb-4 border-4 border-primary/40 w-32 h-32 object-cover" />
                      ) : (
                        <Image
                          src={resolvedImageUrls[member.name] as string}
                          alt={`Portrait of ${member.name}, ${member.role}`}
                          width={128}
                          height={128}
                          className="rounded-full mx-auto mb-4 border-4 border-primary/40 w-32 h-32 object-cover"
                          data-ai-hint={member.dataAiHint}
                          unoptimized={resolvedImageUrls[member.name]?.includes('placehold.co')} 
                        />
                      )}
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm sm:text-base text-accent">{member.role}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flip-card-back">
                  <Card className="w-full h-full flex flex-col shadow-lg">
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-lg sm:text-xl text-primary">{member.name}</CardTitle>
                      <p className="text-sm text-accent -mt-1">{member.role}</p>
                    </CardHeader>
                    <CardContent className="pt-2 text-left space-y-2 sm:space-y-3 overflow-y-auto flex-grow">
                      <div>
                        <h4 className="font-semibold text-accent/90 text-xs sm:text-sm">About</h4>
                        <p className="text-xs sm:text-sm text-foreground">{member.intro}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-accent/90 text-xs sm:text-sm">Profession</h4>
                        <p className="text-xs sm:text-sm text-foreground">{member.profession}</p>
                      </div>
                      {member.socials && member.socials.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-accent/90 text-xs sm:text-sm">Connect</h4>
                          <div className="flex space-x-2 sm:space-x-3 mt-1">
                            {member.socials.map(social => (
                              <a
                                key={social.platform}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/70"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <social.icon size={18} aria-label={social.platform} />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-base sm:text-lg text-foreground">
            And many more dedicated volunteers and supporters who make our work possible!
        </p>
      </section>
    </div>
  );
}

