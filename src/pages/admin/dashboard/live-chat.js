export default function LiveChat() {
  return (
    <div className="flex flex-col font-poppins h-screen">
      <div className="mb-2 flex flex-row justify-between">
        <div className="text-3xl">LiveChat</div>
      </div>
      <div className="flex-grow">
        <iframe
          src="https://dashboard.tawk.to/"
          title="LiveChatAdmin"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
}
