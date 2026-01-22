"use client";
import React from "react";
import {
    Github,
    Twitter,
    Linkedin,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

const footerLinks = {
    product: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Integrations", href: "#integrations" },
        { name: "Changelog", href: "#" },
        { name: "Roadmap", href: "#" },
    ],
    company: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Press Kit", href: "#" },
        { name: "Contact", href: "#" },
    ],
    resources: [
        { name: "Documentation", href: "#" },
        { name: "API Reference", href: "#" },
        { name: "Community", href: "#" },
        { name: "Support", href: "#" },
        { name: "Status", href: "#" },
    ],
    legal: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
        { name: "Security", href: "#" },
    ],
};

export function Footer() {
    return (
        <footer className="w-full bg-black border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <span className="text-white font-bold text-xl">
                                Core Platform
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-6 max-w-xs">
                            Transform your business operations with our all-in-one enterprise
                            platform. Built for modern teams who demand excellence.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-purple-500 transition-colors"
                            >
                                <Twitter className="w-5 h-5 text-slate-400" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-purple-500 transition-colors"
                            >
                                <Github className="w-5 h-5 text-slate-400" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-purple-500 transition-colors"
                            >
                                <Linkedin className="w-5 h-5 text-slate-400" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-slate-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-slate-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-slate-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-slate-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="border-t border-slate-800 pt-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                            <div>
                                <div className="text-white font-semibold mb-1">Address</div>
                                <div className="text-slate-400 text-sm">
                                    123 Business Street
                                    <br />
                                    San Francisco, CA 94107
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                            <div>
                                <div className="text-white font-semibold mb-1">Email</div>
                                <div className="text-slate-400 text-sm">
                                    support@coreplatform.com
                                    <br />
                                    sales@coreplatform.com
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                            <div>
                                <div className="text-white font-semibold mb-1">Phone</div>
                                <div className="text-slate-400 text-sm">
                                    +1 (555) 123-4567
                                    <br />
                                    Mon-Fri, 9am-6pm PST
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-slate-400 text-sm">
                        © 2024 Core Platform. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className="text-slate-400 hover:text-white transition-colors text-sm"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="text-slate-400 hover:text-white transition-colors text-sm"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="text-slate-400 hover:text-white transition-colors text-sm"
                        >
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
