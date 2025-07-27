import { ThreeCircles } from "react-loader-spinner";

export const LoaderSpiner = () => {
  return (
    <ThreeCircles
      visible={true}
      height="70"
      width="70"
      color="#eccd43"
      ariaLabel="three-circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};
