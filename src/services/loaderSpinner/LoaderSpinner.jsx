import { ThreeCircles } from "react-loader-spinner";

export const LoaderSpiner = () => {
  return (
    <ThreeCircles
      visible={true}
      height="50"
      width="50"
      color="#eccd43"
      ariaLabel="three-circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};
