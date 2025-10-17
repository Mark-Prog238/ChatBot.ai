import { CustomInput } from "../components/CustumInput";
import { useState } from "react";
export const Chat = () => {
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    console.log("Message:", message);
    setMessage("");
  };

  return (
    <div className="bg-emerald-200 h-screen w-full items-center justify-center flex">
      {/* Message sender  */}
      <div>
        <form className="flex flex-row">
          <CustomInput
            label="enter your message"
            type="text"
            name="message"
            id="message"
            value={message}
            onChange={setMessage}
          />
          <button onClick={submit} type="button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
