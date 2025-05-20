
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Career Designer",
    description: "Answer simple questions about your skills, preferences, and goals to discover your perfect career match.",
    icon: (
      <div className="rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M12 2v8" /><path d="m16 6-4 4-4-4" />
          <path d="M8 16a4 4 0 1 1 8 0" /><path d="M16 19a2 2 0 1 1-3 3" />
        </svg>
      </div>
    ),
  },
  {
    title: "AI Mentor",
    description: "Chat with our AI career assistant to get personalized advice about career transitions, skill improvements, and more.",
    icon: (
      <div className="rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M14 19c3.771 0 5.657 0 6.828-1.172C22 16.657 22 14.771 22 11c0-3.771 0-5.657-1.172-6.828C19.657 3 17.771 3 14 3h-4C6.229 3 4.343 3 3.172 4.172 2 5.343 2 7.229 2 11c0 3.771 0 5.657 1.172 6.828.653.654 1.528.943 2.828 1.07" />
          <path d="M14 19c-1.236 0-2.598.5-3.841 1.145-1.998 1.037-2.997 1.556-3.489 1.225-.492-.33-.399-1.355-.212-3.404L6.5 17.5" />
        </svg>
      </div>
    ),
  },
  {
    title: "Role Explorer",
    description: "Explore detailed information about various career roles including required skills, average salaries, and job demand trends.",
    icon: (
      <div className="rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M21 7v6h-6" /><path d="M3 17v-6h6" />
          <path d="M10 4v16" /><circle cx="14" cy="4" r="1" />
          <circle cx="14" cy="20" r="1" /><path d="M14 15v-3a2 2 0 0 0-2-2H8" />
          <path d="M14 9v3a2 2 0 0 0 2 2h4" />
        </svg>
      </div>
    ),
  },
  {
    title: "Personalized Roadmaps",
    description: "Get a step-by-step customized plan detailing the skills, courses, projects, and certifications you need to reach your career goals.",
    icon: (
      <div className="rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M12 20v-6" /><path d="M17 20v-6" />
          <path d="M7 20v-6" /><path d="M17 14H7" />
          <path d="M7 4v4h10V4" /><rect width="18" height="16" x="3" y="4" rx="2" />
        </svg>
      </div>
    ),
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How CareerPath Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We combine AI and career expertise to help you find and prepare for your ideal professional path.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="h-full border shadow-sm transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
