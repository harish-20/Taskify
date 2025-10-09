interface GraphProps {
  className?: string;
}

const Graph: React.FC<GraphProps> = (props) => {
  const { className = "" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100px"
      height="100px"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M4 5V19C4 19.5523 4.44772 20 5 20H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 9L13 13.9999L10.5 11.4998L7 14.9998"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default Graph;
