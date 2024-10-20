import { useSelector } from "react-redux";

function Home() {
  const auth = useSelector((state) => state.auth.value);
  return (
    <div>
      <div className="p-3">
        <h1>Hi {auth?.firstName}!</h1>
      </div>
    </div>
  );
}

export default Home;
