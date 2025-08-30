import loading from "../assets/gifs/loading.gif";

const Loading: React.FC = () => {
  return (
    <div className="w-[max-content] mx-auto">
      <img className="w-[50px]" src={loading} alt="loading" />
    </div>
  );
};

export default Loading;
