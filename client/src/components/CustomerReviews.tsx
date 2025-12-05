import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  weddingType: string;
  avatar?: string;
}

const reviews: Review[] = [
  {
    id: "1",
    name: "Priya & Rahul Sharma",
    location: "Mumbai, India",
    rating: 5,
    date: "2024-11-15",
    review: "We used WeddingInvite.ai for our Hindu wedding invitation and it was absolutely stunning! The Punjabi template captured our traditions perfectly. Our guests loved receiving the video on WhatsApp - so convenient!",
    weddingType: "Hindu Wedding",
  },
  {
    id: "2",
    name: "Fatima Al-Hassan",
    location: "Dubai, UAE",
    rating: 5,
    date: "2024-11-20",
    review: "The Arabic wedding invitation template was elegant and perfectly captured our Gulf wedding traditions. The bilingual support for English and Arabic made it easy for all our guests to understand. Highly recommended!",
    weddingType: "Arabic Wedding",
  },
  {
    id: "3",
    name: "Ananya & Karthik Reddy",
    location: "Hyderabad, India",
    rating: 5,
    date: "2024-10-28",
    review: "Created beautiful invitations for our South Indian wedding. The temple wedding design was authentic and the customization options were incredible. The music selection added such a nice touch!",
    weddingType: "South Indian Wedding",
  },
  {
    id: "4",
    name: "Ahmed & Noura",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    date: "2024-11-05",
    review: "Perfect for our Saudi wedding celebration! The design was luxurious and elegant. We loved how easy it was to share with our guests. The video quality was excellent.",
    weddingType: "Saudi Wedding",
  },
  {
    id: "5",
    name: "Simran & Gurpreet Singh",
    location: "Delhi, India",
    rating: 5,
    date: "2024-09-18",
    review: "Our Punjabi wedding invitation was a hit with all our relatives! The Bhangra-themed video with the marigold decorations was so vibrant and colorful. Everyone asked us where we made it!",
    weddingType: "Punjabi Wedding",
  },
  {
    id: "6",
    name: "Deepika & Arjun Nair",
    location: "Chennai, India",
    rating: 5,
    date: "2024-10-10",
    review: "Used it for our engagement ceremony invitation. The customization was so easy - we added our photos and it looked professional. Great value for money compared to traditional print invitations.",
    weddingType: "Engagement Ceremony",
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function CustomerReviews() {
  const aggregateRating = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "WeddingInvite.ai Video Invitations",
    "description": "Premium wedding video invitation maker for Indian, Arabic, and international weddings",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": reviews.length.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(r => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.name
      },
      "datePublished": r.date,
      "reviewBody": r.review,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    }))
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30" id="reviews">
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRating) }}
      />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            <Star className="w-4 h-4 fill-current" />
            4.9 out of 5 based on {reviews.length}+ reviews
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by Couples Worldwide
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what couples from India, UAE, and Saudi Arabia say about their wedding invitation experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <Card 
              key={review.id} 
              className="p-6 relative overflow-hidden"
              data-testid={`card-review-${review.id}`}
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-muted'}`}
                  />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "{review.review}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {review.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{review.weddingType}</span>
                <span>{formatDate(review.date)}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-muted-foreground">
            Join <span className="font-semibold text-foreground">10,000+</span> happy couples who created their perfect invitation
          </p>
        </div>
      </div>
    </section>
  );
}
