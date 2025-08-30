interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="border-[1px] px-2 py-8 md:px-9 rounded overflow-auto bg-[#fbfbfb]"
      style={{ boxShadow: "0 0 20px 3px #96beee26" }}
    >
      {children}
    </div>
  );
};

export default Container;
