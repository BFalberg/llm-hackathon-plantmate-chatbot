import plantMateStartBg from "../assets/plant-mate-start-bg.png";
import plantMateLogoHvid from "../assets/plant-mate-logo-hvid.svg";
import { Link } from "react-router";

export default function Start() {
  return (
    <div className="start-page">
      <div className="">
        <img
          src={plantMateStartBg}
          alt="Plant Mate Background"
          className="header-bg-image"
        />

        <div className="header-content">
          <img
            src={plantMateLogoHvid}
            alt="Plant Mate Logo"
            className="logo-image"
          />
          <p>Your plate. Your choice. Live more</p>
          <p>plant-based, get inspired and create</p>
          <p>your community.</p>
        </div>
      </div>

      <div className="bottom-buttons">
        <p>Tell us which fits you better</p>
        <Link to={"/login"} className="primary-btn">
          I am already plant-based
        </Link>
        <Link to={"/register"} className="secondary-btn">
          I am new to this
        </Link>
      </div>

      <div className="bottom-note">
        <p>
          Already have an account?<u> Log in</u>.
        </p>
      </div>
    </div>
  );
}
