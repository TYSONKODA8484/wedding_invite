import { SEOHead } from "@/components/SEOHead";
import { HeroSection } from "@/components/HeroSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Users, Zap, Shield, BarChart, Palette, Globe } from "lucide-react";
import { Link } from "wouter";
import corporateHero from "@assets/generated_images/Corporate_enterprise_page_hero_b2978cb0.png";

export default function Enterprise() {
  const solutions = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Event Planning Agencies",
      description: "Manage multiple client projects with team collaboration, brand customization, and client approval workflows.",
      features: ["Team collaboration", "Client management", "Brand templates", "Project tracking"],
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "White-Label Solution",
      description: "Offer video invitations under your own brand. Custom domain, branding, and seamless integration with your services.",
      features: ["Custom branding", "Your domain", "API access", "No WeddingInvite.ai logos"],
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Corporate Events",
      description: "Professional video invitations for conferences, product launches, networking events, and company celebrations.",
      features: ["Corporate templates", "Bulk creation", "Analytics", "Priority support"],
    },
  ];

  const enterpriseFeatures = [
    "Unlimited video creation",
    "Dedicated account manager",
    "Custom template development",
    "API integration",
    "White-label options",
    "SSO / SAML authentication",
    "Advanced analytics dashboard",
    "Priority 24/7 support",
    "Custom SLA agreements",
    "Training & onboarding",
    "Volume discounts",
    "Invoicing & PO support",
  ];

  return (
    <>
      <SEOHead
        title="Enterprise Solutions - Event Planning & White-Label"
        description="Enterprise video invitation solutions for event planners, agencies, and businesses. White-label options, API integration, and team collaboration tools."
        keywords="enterprise video invitations, white-label invitation platform, event planning software, corporate video invitations"
      />

      <HeroSection
        title="Enterprise Solutions"
        subtitle="For Event Planners & Businesses"
        description="Powerful tools and white-label solutions for event planning agencies, corporate teams, and businesses managing multiple clients and events."
        backgroundImage={corporateHero}
        height="large"
        primaryCTA={{
          text: "Schedule Demo",
          href: "#contact",
        }}
        secondaryCTA={{
          text: "View Pricing",
          href: "#pricing",
        }}
      />

      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Solutions for Every Business
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Tailored packages for event planners, agencies, and corporate teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {solutions.map((solution, index) => (
              <Card key={index} className="p-8 hover-elevate transition-all" data-testid={`solution-${index}`}>
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  {solution.icon}
                </div>
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-3">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {solution.description}
                </p>
                <ul className="space-y-3">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Enterprise Features
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Everything your business needs to scale video invitation creation across teams, clients, and events.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enterpriseFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3" data-testid={`feature-${index}`}>
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center hover-elevate transition-all">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="font-playfair text-3xl font-bold text-foreground mb-2">10x</div>
                <p className="text-muted-foreground text-sm">Faster Creation</p>
              </Card>
              <Card className="p-6 text-center hover-elevate transition-all">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="font-playfair text-3xl font-bold text-foreground mb-2">500+</div>
                <p className="text-muted-foreground text-sm">Enterprise Clients</p>
              </Card>
              <Card className="p-6 text-center hover-elevate transition-all">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="font-playfair text-3xl font-bold text-foreground mb-2">99.9%</div>
                <p className="text-muted-foreground text-sm">Uptime SLA</p>
              </Card>
              <Card className="p-6 text-center hover-elevate transition-all">
                <BarChart className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="font-playfair text-3xl font-bold text-foreground mb-2">24/7</div>
                <p className="text-muted-foreground text-sm">Support</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-background" id="contact">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg lg:text-xl mb-8">
            Schedule a demo with our enterprise team to discuss your specific needs and custom pricing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="default" size="lg" asChild data-testid="button-schedule-demo">
              <Link href="/contact">
                <a className="font-semibold">Schedule a Demo</a>
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild data-testid="button-contact-sales">
              <Link href="/contact">
                <a>Contact Sales</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
