const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full items-center justify-center">{children}</div>
  );
};

export default layout;
