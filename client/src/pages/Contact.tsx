import { SEOHead } from "@/components/SEOHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <>
      <SEOHead
        title="Contact Us - Get in Touch"
        description="Contact WeddingInvite.ai for support, sales inquiries, or partnership opportunities. We're here to help with your video invitation needs."
        keywords="contact WeddingInvite.ai, customer support, sales inquiry, partnership"
      />

      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <Card className="p-8 lg:p-12">
              <h2 className="font-playfair text-3xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-foreground">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className="mt-2"
                    data-testid="input-name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="mt-2"
                    data-testid="input-email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-foreground">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="mt-2"
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-foreground">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    className="mt-2"
                    data-testid="input-subject"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-foreground">Message *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="mt-2"
                    data-testid="textarea-message"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full font-semibold"
                  data-testid="button-submit"
                >
                  Send Message
                </Button>
              </form>
            </Card>

            <div className="space-y-8">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-foreground mb-6">
                  Contact Information
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Reach out to us through any of these channels. We're here to help!
                </p>
              </div>

              <Card className="p-6 hover-elevate transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">support@weddinginvite.ai</p>
                    <p className="text-muted-foreground">sales@weddinginvite.ai</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground text-sm">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      123 Innovation Drive<br />
                      San Francisco, CA 94105<br />
                      United States
                    </p>
                  </div>
                </div>
              </Card>

              <div className="bg-card border border-card-border rounded-md p-6">
                <h3 className="font-semibold text-foreground mb-3">Business Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
