function ContentBox({ children }) {
  return (
    <div className="bg-slate-50 shadow-md border rounded-lg p-6 m-3 max-w-md mx-auto">
      {children}
    </div>
  );
}

export default ContentBox;
