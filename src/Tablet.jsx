/** Button that attempts to use the token in context when clicked */
import { useAuth } from "./AuthContext";

export default function Tablet() {
  //calls useAuth hook to get context value
  //remember useAuth returns an object. this commands javascript to find the property inside the object named authenticate and create a new const called authenticate with that value
  const { authenticate } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await authenticate(); // call the context’s authenticate()
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section>
      <p>
        The sound of your name thuds against the gate as the two badgers furrow
        their brows. The badger on the right beckons you to approach.
      </p>
      <p>"Only those who are pure of heart may pass."</p>
      <p>
        "Place your hand upon this stone tablet, and thus will your true self be
        revealed."
      </p>
      <p>
        It holds out a rectangular stone tablet carved with an intricate design.
      </p>
      <form onSubmit={handleSubmit}>
        <button type="submit">Place your palm upon the tablet.</button>
      </form>
    </section>
  );
}
