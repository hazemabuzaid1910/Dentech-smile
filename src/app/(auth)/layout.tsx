export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="p-4 w-fit">
        {children}
      </div>
    </div>
  );
}