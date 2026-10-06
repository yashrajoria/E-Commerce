import { motion } from "framer-motion";
import { Cpu, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
  Infrastructure: ["Core API", "Webhooks", "Edge Sync", "Auth layers", "Node Status"],
  Governance: ["Compliance", "Audit Logs", "IAM", "Security", "Reliability"],
  Ecosystem: ["Plugins", "Connectors", "SDKs", "Marketplace", "Community"],
  Enterprise: ["Support", "SLA", "Privacy", "Terms", "GDPR"],
};

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-[#050505] pt-24 pb-12">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-2 space-y-8">
            <a href="#" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Cpu className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] leading-none uppercase">ShopSwift</span>
                <span className="text-[8px] font-light text-muted-foreground tracking-widest uppercase">Admin Pro</span>
              </div>
            </a>
            <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-xs font-light">
              Architected for the next generation of industrial commerce. 
              Reliable, secure, and infinitely scalable infrastructure.
            </p>

            {/* Newsletter */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">System Updates</p>
              <div className="flex gap-2 max-w-sm">
                <Input
                  type="email"
                  placeholder="operator@domain.com"
                  className="h-11 bg-white/[0.02] border-white/[0.06] rounded-xl text-xs focus:ring-primary/20"
                />
                <Button
                  size="sm"
                  className="bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 rounded-xl h-11 px-6 text-xs font-bold uppercase tracking-widest"
                >
                  Join
                </Button>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-[10px] font-bold text-foreground/80 uppercase tracking-[0.2em]">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-muted-foreground/50 hover:text-primary transition-colors font-medium"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} ShopSwift Admin Pro
            </p>
            <div className="flex items-center gap-4">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
               <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">Nodes Operational</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                whileHover={{ y: -2 }}
                className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-muted-foreground/40 hover:text-primary hover:bg-white/[0.05] transition-all"
              >
                <social.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
