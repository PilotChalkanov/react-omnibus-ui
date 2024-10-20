import Button from "./Button";

function Sidebar() {
  return (
    <div className="bg-slate-100 border-r  border-slate-200  vh-full p-3 ">
      {/* Tailwind classes for sidebar styling */}
      <h4 className="text-lg font-semibold ms-2 mb-4">Menu</h4>
      <div className="flex flex-col gap-3">
        <Button type="link" to="/">
          Home
        </Button>
        <Button type="link" to="/connections">
          Service Connections
        </Button>
        <Button type="link" to="connections/paired">
          Paired Connections
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
