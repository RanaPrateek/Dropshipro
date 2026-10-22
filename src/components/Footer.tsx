export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-500">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Dropshipro. All rights reserved.
          </p>
          <p className="text-slate-400">
            Fast shipping · 30-day returns · Secure checkout
          </p>
        </div>
      </div>
    </footer>
  );
}
