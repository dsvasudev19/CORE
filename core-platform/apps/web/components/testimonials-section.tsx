"use client";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO at TechCorp",
    company: "TechCorp Inc.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content:
      "Core Platform transformed how we manage our team. The intuitive interface and powerful features have increased our productivity by 40%.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Project Manager",
    company: "Innovation Labs",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    content:
      "The best project management tool we've used. Real-time collaboration and time tracking features are game-changers for our remote team.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "HR Director",
    company: "Global Solutions",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    content:
      "Managing 200+ employees has never been easier. The HR module is comprehensive and the support team is incredibly responsive.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <div className="w-full bg-black py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Loved by Teams Worldwide
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            See what our customers have to say about their experience with Core
            Platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <CardContainer key={index} className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:bg-slate-900 dark:border-slate-800 border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="w-full">
                  <Quote className="w-8 h-8 text-purple-500 mb-4" />
                </CardItem>

                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-300 text-sm mb-6 leading-relaxed"
                >
                  {testimonial.content}
                </CardItem>

                <CardItem translateZ="100" className="w-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                </CardItem>

                <CardItem translateZ="80" className="w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {testimonial.name}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {testimonial.role}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-4 rounded-full bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              <span className="text-white font-semibold">4.9/5</span>
              <span className="text-slate-400 text-sm">on G2</span>
            </div>
            <div className="w-px h-6 bg-slate-700" />
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              <span className="text-white font-semibold">4.8/5</span>
              <span className="text-slate-400 text-sm">on Capterra</span>
            </div>
            <div className="w-px h-6 bg-slate-700" />
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              <span className="text-white font-semibold">5/5</span>
              <span className="text-slate-400 text-sm">on ProductHunt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
