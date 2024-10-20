function Loader({ fullscreen }) {
  // Fullscreen loader with background blur
  if (fullscreen)
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-200/20 backdrop-blur-sm">
        <div className="loader"></div>
      </div>
    );
  return (
    // Spinner loader
    // <div className="flex flex-grow justify-center items-center mt-20 ">
    //   <span className=" inline-block animate-spin border-4 border-t-transparent border-gray-600 rounded-full w-8 h-8"></span>
    // </div>
    <div className="flex flex-grow justify-center items-center mt-20 ">
      <div className="loader"></div>
    </div>
  );
}
// absolute inset-0
export default Loader;
