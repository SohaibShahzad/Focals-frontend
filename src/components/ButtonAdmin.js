import { useStateContext } from '@/contexts/ContextProvider';

const ButtonAdmin = ({ icon, bgColor, color, bgHoverColor, size, text, borderRadius, width }) => {
  const { setIsClicked, initialState } = useStateContext();

  return (
    <button
      type="button"
      onClick={() => setIsClicked(initialState)}
      style={{ color, borderRadius }}
      className={` text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor} bg-${bgColor}`}
    >
      {icon} {text}
    </button>
  );
};

export default ButtonAdmin;
