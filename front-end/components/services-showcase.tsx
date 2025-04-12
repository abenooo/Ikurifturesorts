import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpadeIcon as Spa, Utensils, Waves, Dumbbell } from "lucide-react"

export default function ServicesShowcase() {
  const services = [
    {
      id: "spa",
      icon: <Spa className="h-6 w-6" />,
      title: "Spa & Wellness",
      description:
        "Our spa offers a sanctuary of relaxation with a range of treatments inspired by Ethiopian traditions and international techniques. Enjoy massages, facials, and body treatments in our serene environment.",
      features: ["Traditional massages", "Facial treatments", "Body scrubs", "Aromatherapy", "Couples packages"],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "dining",
      icon: <Utensils className="h-6 w-6" />,
      title: "Fine Dining",
      description:
        "Experience culinary excellence at our restaurants featuring both local Ethiopian delicacies and international cuisine. Our chefs use fresh, locally-sourced ingredients to create memorable dining experiences.",
      features: [
        "Lakeside dining",
        "Ethiopian cuisine",
        "International menu",
        "Private dining options",
        "Wine selection",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "activities",
      icon: <Waves className="h-6 w-6" />,
      title: "Lakeside Activities",
      description:
        "Make the most of our stunning lakeside locations with various water activities. From kayaking to sunset boat tours, there's something for everyone to enjoy on our pristine waters.",
      features: ["Kayaking", "Boat tours", "Fishing", "Swimming", "Sunset cruises"],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "fitness",
      icon: <Dumbbell className="h-6 w-6" />,
      title: "Fitness Center",
      description:
        "Stay active during your stay with our modern fitness facilities. Our centers are equipped with state-of-the-art equipment and offer personal training sessions upon request.",
      features: ["Modern equipment", "Personal trainers", "Yoga classes", "Outdoor activities", "Fitness programs"],
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <section className="w-full py-16 bg-[#f5f2ea]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-medium tracking-tight">Experience Our Services</h2>
          <p className="text-muted-foreground max-w-[700px]">
            Discover the exceptional amenities and services that make Kuriftu Resorts a premier destination for
            relaxation and adventure.
          </p>
        </div>

        <Tabs defaultValue="spa" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-transparent h-auto p-0 mb-8">
            {services.map((service) => (
              <TabsTrigger
                key={service.id}
                value={service.id}
                className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                {service.icon}
                <span className="hidden md:inline">{service.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {services.map((service) => (
            <TabsContent key={service.id} value={service.id} className="mt-0">
              <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium flex items-center gap-2">
                    {service.icon}
                    {service.title}
                  </h3>
                  <p className="text-neutral-600">{service.description}</p>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Highlights:</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-neutral-800" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
