import React, { useContext } from 'react';
import { GPTContext } from '../utils/providers/GPTContext';

const CodeComponent: React.FC = () => {
  const { messages } = useContext(GPTContext);
  const filteredMessages = messages.filter( (message) => message.role !== 'system');
  const parseMessage = (message: string) => {
    // filter the message looking for code inside triplebackticks
    const tripleQuoteRegex = /```([\s\S]*?)```/;
    const match = message.match(tripleQuoteRegex);
    const content = match ? match[1] : "";

    return content;

    // return the code inside the triplebackticks
  };
  const handleRender = () => {
    // render the code inside the triplebackticks
    alert("HI")
  };
  const messagesContent = filteredMessages.map( (message, index) => {
    const parsedMessage = parseMessage(message.content);
    let content = ""
    if(parsedMessage !== "") {
      content = message.content.replace(parsedMessage, `<pre style="background-color: #AFAFAF; padding: 5px; border-radius: 10px;"><code>${parsedMessage}</code></pre>`);
      content = content.replace(/```/g, "<br/>");
    }else{
      content = message.content;
    }
    return (
      <div key={index} className={`flex flex-row ${(message.role === 'system' || message.role === 'assistant') ? 'justify-start' : 'justify-end'}`}>
        <div className={`  bg-gray-600 text-white m-1 p-1 rounded ${message.role === 'system' ? 'w-1/2' : 'w-3/4'}`}>

          { content }
          <br />
          { parsedMessage !== "" && <button className="text-gray-400" onClick={handleRender}>Render snippet</button> }
          {' '}
        </div>
      </div>
    );
  }
  );

  return (
    <div className="bg-gray-800 text-white rounded h-full break-words overflow-auto max-h-400 max-w-full">
      { messagesContent }
    </div>
  );
};

export default CodeComponent;