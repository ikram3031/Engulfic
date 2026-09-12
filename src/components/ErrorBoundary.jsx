import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Engulfic ErrorBoundary] Uncaught render error:', error, errorInfo);
  }

  handleReload = () => {
    try {
      window.location.reload();
    } catch (_) {
      window.location.href = '/';
    }
  };

  handleResetAndHome = () => {
    try {
      localStorage.removeItem('luxury_cart');
      localStorage.removeItem('luxury_wishlist');
      localStorage.removeItem('luxury_categories');
      localStorage.removeItem('luxury_user');
      localStorage.removeItem('engulfic-theme');
      sessionStorage.clear();
    } catch (_) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md w-full space-y-6">
            <div className="space-y-2">
              <span className="text-3xl sm:text-4xl font-black uppercase tracking-[0.35em] text-white font-['Josefin_Sans']">
                ENGULFIC
              </span>
              <p className="text-[10px] uppercase tracking-[0.45em] text-orange-500 font-semibold">
                Haute Streetwear • Dhaka
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-4 shadow-2xl">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Something went wrong loading this view
              </h2>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                An unexpected display issue occurred. Refreshing the page or clearing cached temporary data resolves this immediately.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] cursor-pointer"
                >
                  Reload Page
                </button>
                <button
                  type="button"
                  onClick={this.handleResetAndHome}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 text-white/80 hover:text-white border border-white/10 font-mono text-[11px] uppercase tracking-wider rounded-full transition-all cursor-pointer"
                >
                  Clear Cache & Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
