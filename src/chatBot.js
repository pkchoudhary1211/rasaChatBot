import React from 'react'
import { Widget, addResponseMessage, addLinkSnippet,setQuickButtons,createQuickButton, addUserMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
require('./static/css/style.css')
const axios = require('axios');
const socket = io.connect('http://localhost:5005');
const instance = axios.create({
    baseURL: 'http://localhost:5005',
});
class ChatBot extends React.Component{
    
    constructor(props)
    {   super(props)   
        this.state={
            buttonsArray:null
        }
        console.log('this is constructor')
    }
    componentDidMount() {
        addResponseMessage("Welcome to this awesome chat!");
        
    }
    handleQuickButtonClicked=(event)=>{
        console.log('buttons',this.state.buttonsArray)
        for(var i=0;i<this.state.buttonsArray.length;i++){
            if(this.state.buttonsArray[i].value==event){
                addUserMessage(this.state.buttonsArray[i].label)
                break;
            }
        }
        setQuickButtons([])
        this.handleNewUserMessage(event)
    }
    handleNewUserMessage = (newMessage) => {
        console.log(`New message incoming! ${newMessage}`);
        let bodyData={
            message:'user',
            customData:{"user_id":123},session_id:'6acbad2a3d4742f3b891ac384e0b'
        }
        // http://localhost:5005/webhooks/rest/webhook
        // WebChat.default.init
        // var socket = require('socket.io-client')('http://localhost:5005/webhooks/rest/webhook',{sender:"pk",message:newMessage});
        // console.log('soket',socket)
        // socket.on('bot_uttered', function(data){
        //     console.log('bot_uttered',data)
        // });
        // ["user_uttered",{"message":"hello","customData":{"userId":"123"},"session_id":"310b68bd6eb04a679401e92f949186d3"}]
        instance({
            url:"/webhooks/rest/webhook",
            method:'POST',
            data:{sender:"pk",message:newMessage}
        }).then(res=>{
            if(res.data.length>0){
                addResponseMessage(res.data[0].text)
                if(res.data[0].hasOwnProperty('buttons'))
                {   let buttons=[];
                    for(var i=0;i<res.data[0].buttons.length;i++){
                       buttons[i]={'label':res.data[0].buttons[i].title,'value':res.data[0].buttons[i].payload} 
                    }
                    this.setState({
                        buttonsArray:buttons
                    })
                    console.log('buttons',buttons)
                    setQuickButtons(buttons)
                }
            }
            else{
                addResponseMessage("Try Again")
            }
            }).catch(err=>{
                console.log('User Errror',err)
        })
    }
    render(){
        return(
            <React.Fragment>
                <h1 className="centerValue">Chat With boat in Rasa</h1>
                <Widget
                    handleNewUserMessage={this.handleNewUserMessage}
                    handleQuickButtonClicked={this.handleQuickButtonClicked}
                    title="Chat With AI Bot"
                    selector= {"#webchat"}
                    initPayload= {"/get_started"}
                    subtitle={"Rasa Chat"}
                    socketUrl={"http://localhost:5005"}
                    socketPath={"/socket.io/"}
                    customData={{"userId": "123"}} // arbitrary custom data. Stay minimal as this will be added to the socket
                    inputTextFieldHint={"Type a message..."}
                    connectingText={"Waiting for server..."}
                    hideWhenNotConnected
                    connectOn={"mount"}
                    embedded={true}
                />
            </React.Fragment>
        )
    }
}
export default ChatBot