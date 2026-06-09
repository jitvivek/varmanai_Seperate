export function Footer() {
  return (
    <footer className="border-t border-varman-steel py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <path d="M32 4L58 18V46L32 60L6 46V18L32 4Z" stroke="#22D3EE" strokeWidth="3" fill="none" />
                <path d="M22 22L32 44L42 22" stroke="#F5B544" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-display text-lg font-bold text-varman-mist">VarmanAI</span>
            </div>
            <p className="text-varman-fog text-sm">Armor for your AI.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-varman-mist font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-varman-fog hover:text-varman-cyan transition">Features</a></li>
              <li><a href="/pricing" className="text-varman-fog hover:text-varman-cyan transition">Pricing</a></li>
              <li><a href="#how-it-works" className="text-varman-fog hover:text-varman-cyan transition">How it works</a></li>
              <li><a href="/dashboard" className="text-varman-fog hover:text-varman-cyan transition">Dashboard</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-varman-mist font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/docs" className="text-varman-fog hover:text-varman-cyan transition">Documentation</a></li>
              <li><a href="/blog" className="text-varman-fog hover:text-varman-cyan transition">Blog</a></li>
              <li><a href="#faq" className="text-varman-fog hover:text-varman-cyan transition">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-varman-mist font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="text-varman-fog hover:text-varman-cyan transition">Privacy</a></li>
              <li><a href="/terms" className="text-varman-fog hover:text-varman-cyan transition">Terms</a></li>
              <li><a href="/contact" className="text-varman-fog hover:text-varman-cyan transition">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-varman-mist font-semibold text-sm mb-3">Install</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-varman-fog hover:text-varman-cyan transition">Chrome Extension</a></li>
              <li><a href="#" className="text-varman-fog hover:text-varman-cyan transition">Edge Add-on</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-varman-steel pt-8 text-center">
          <p className="text-varman-fog text-sm">
            © {new Date().getFullYear()} VarmanAI. All rights reserved. Built in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
