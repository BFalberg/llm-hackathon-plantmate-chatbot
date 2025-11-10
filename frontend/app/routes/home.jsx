import { Link, Form } from "react-router";
import bison from "../assets/bison.svg";
import { ChevArrowRight } from "../components/Icons";
import SearchBar from "../components/searchBar";
import ChatBubble from "../components/chatBubble";

const bisonSuggestions = [
  {
    id: 1,
    label: "Breakfast 🥣",
    message: "How about a smoothie bowl with fresh fruits and granola?",
  },
  {
    id: 2,
    label: "Dessert 🍪",
    message: "Try baking some classic chocolate chip cookies!",
  },
  {
    id: 3,
    label: "Lunch 🥗",
    message: "A quinoa salad with roasted veggies sounds delicious!",
  },
  {
    id: 4,
    label: "More 👀",
    message: "Check out more meal ideas on our blog!",
  },
];

export default function Home() {
  return (
    <div className="page-home">
      <SearchBar />
      <div className="ask-bison">
        <Link to={"/chat"} className="ask-bison-link" viewTransition>
          <img src={bison} alt="bison" className="bison-icon" />
          <ChatBubble
            role="assistant"
            label="true"
            content="Out of ideas for your next meal? DM me 😉"
          />
          <ChevArrowRight />
        </Link>
        <div className="suggestions">
          {bisonSuggestions.map((suggestion, index) => (
            <Link
              key={suggestion.id}
              to="/chat"
              state={{ message: suggestion.message }}
              className="suggestion"
              viewTransition
            >
              <span className="suggestion-label">{suggestion.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
