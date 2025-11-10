import { Link } from "react-router";
import logo from "../assets/plant-mate-logo.svg";
import { QrCode, Menu } from "./Icons";

export default function AppHeader() {
  return (
    <header className="app-header">
      <QrCode />
      <Link to={"/"} className="app-logo" viewTransition>
        <img src={logo} alt="Plant Mate logo" className="app-logo" />
      </Link>
      <Link to={"/threads"} className="threads-link" viewTransition>
        <Menu />
      </Link>
    </header>
  );
}
