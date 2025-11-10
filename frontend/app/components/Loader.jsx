import bison from "../assets/bison.svg";
export default function Loader() {
  return (
    <div className="app-loader">
      <img src={bison} alt="Loading..." className="loader-image bison-icon" />
      <span>Growing your plants...</span>
    </div>
  );
}
