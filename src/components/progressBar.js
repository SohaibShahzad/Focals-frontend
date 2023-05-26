export default function ProgressBar({ progress }) {
    const calculateColor = (progress) => {
      let color;
      if (progress < 25) {
        color = `rgb(${204 * (progress / 25)}, 0, 0)`; // Red to orange
      } else if (progress < 50) {
        color = `rgb(204, ${204 * ((progress - 25) / 25)}, 0)`; // Orange to yellow
      } else if (progress < 75) {
        color = `rgb(${204 - 204 * ((progress - 50) / 25)}, 204, 0)`; // Yellow to green
      } else {
        color = `rgb(0, 200, 50)`; // Solid green
      }
      return color;
    };
  
    return (
      <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
        <div 
          className="h-full"
          style={{
            width: `${progress}%`,
            backgroundColor: calculateColor(progress)
          }}
        />
      </div>
    );
  }
  