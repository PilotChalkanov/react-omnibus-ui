import Button from "./Button";

function NotFound() {
  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      <h1>Page Not Found 😢</h1>

      <Button type="link" onClick={() => history.back()}>
        Go Back
      </Button>
    </div>
  );
}

export default NotFound;
