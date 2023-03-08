import React, { useEffect, useState } from 'react'
import png from './github.png'
import ScrollToBottom from 'react-scroll-to-bottom'
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_API ,//kartikaysaxena12
});

const openai = new OpenAIApi(configuration);
function refreshPage() {

    window.location.reload(false);
  }
  

export default function Chat({socket, username, room, token}) {
    const [currentMessage,SetcurrentMessage] = useState('')
    const [messageList,setMessageList] = useState([])
    const [value,Setvalue] = useState('')


    const sendMessage = async () => {
        if (currentMessage !== "") {
          const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };
          await socket.emit("send_message", messageData);
          setMessageList((list) => [...list, messageData]);
          SetcurrentMessage('')

        }
      };

    useEffect(()=> {
        socket.on('receive_message', (data)=> {

            setMessageList((list)=> [...list,data])
            Setvalue(data.message)
        })
    }, [socket])
    
    const toggle = async() => {
        var newtoken
        if (token=='10')
        {
            newtoken=10;
        }
        else if (token =='100')
        {
            newtoken=100
        }
        else if(token=='3000') {
            newtoken=3000

        }
        console.log(newtoken)
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: value,
            temperature: 0.8,
            max_tokens: newtoken
          });
          console.log(response.data.choices[0].text)
          const chatGpt = response.data.choices[0].text.substring(1)
          console.log('this is from open')
      
          SetcurrentMessage(chatGpt)

    }
    
    return (
        <div className="chat-window">
      <div className="chat-header">
        <p>🟢 &#160;  Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
            id='chat'
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            SetcurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={toggle}>Toggle</button>
        <button type='submit' onClick={sendMessage}>&#9658;</button>
      </div>
      <div className='d-flex justify-content-center mt-5'>
        <button type="button" onClick={refreshPage} class="btn btn-dark">Logout</button>
      </div>
      <div className="d-flex justify-content-center mar-t">
        <p >Made with ❤️ by Kartikay &#160; 
          <a href="https://github.com/kartikaysaxena"><img src={png} className='img-1' alt="" /></a>
            </p>
      </div>

    </div>
    )
}

