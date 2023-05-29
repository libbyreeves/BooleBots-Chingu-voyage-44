import React, { useEffect, useState } from 'react';
import singleBot from "../assets/bot.png";
import Swal from "sweetalert2"; 
import { Link } from 'react-router-dom';
import generateRandomNumber from '../utils/randomNum';
import BotClass from '../Components/Gameplay/BotClass';

export default function BotsInfo(props) {

  // const [botName, setBotName] = useState('');
  // const [booleanValue, setBooleanValue] = useState('1');
  // const [booleanOperator, setBooleanOperator] = useState('and');
  // const [botSpeed, setBotSpeed] = useState(0);
  // const [botDirection, setBotDirection] = useState('north');

  const { botsData, setBotsData, botsArr, arenaData, setBotsArr } = props;
  const tileNum = arenaData.tileNum
  // const [createdBots, setCreatedBots] = useState([]);

  //Refactoring Form state management
  //Refactoring Form state management
  const [formData, setFormData]= useState({
    position:1,
    direction:"",
    tile:"4",
    name:"",
    colorClass:"yellow",
    value: "",
    wins:0,
    loses: 0,
    isAlive:true,
  })
  const addbot = props.addBotToArray;
  const createdBots = props.botsArray;
  const [isValid, setIsValid]= useState(true);
 


  // Generic change handler
  function handleChange(e){
    const changedField = e.target.name;
    const newValue = e.target.value;

    setBotsData((currentData) => {
      /* const newState = { ...currentData }
        newState[changedField] = newValue;
          return newState */
    if(changedField === 'name'){
      if (createdBots.some((bot) => bot.name === newValue)) {
        // Display an error message or perform necessary actions
        console.log("Bot with the same name already exists.");
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '* No Two Robots can have same names',
          // footer: '<a href="">Why do I have this issue?</a>'
        })
        
        setIsValid(false);
      }
      else{setIsValid(true)}
    }
    setFormData((currentData)=>{
      currentData[changedField] = newValue;
      return {...currentData};
    })

  })

  //form event- submit
  const handleSubmit = (event) => {
    console.log("SUBBITING BOTS INFO")
    event.preventDefault();
    
    let occupiedPositions = []
    if(botsArr.length){
      botsArr.forEach(bot => {
        if(bot.position){
            occupiedPositions.push(
            bot.position,
            bot.position + 1,
            bot.position - 1,
            bot.position + tileNum,
            bot.position - tileNum
          );
        }
      })
    }
    
    const generateUniquePosition = () =>{
      //generate a number between 1 to tileNum** but not any num in the occupiedPosition arr
      let isValid = false
      let position;
      
      do{
        position = generateRandomNumber(tileNum * tileNum)


        if(!occupiedPositions.includes(position)){
          isValid = true
        }
        
      }while(!isValid)
      return position
    }


    let pos = occupiedPositions.length
      ? generateUniquePosition()
      : generateRandomNumber(tileNum * tileNum); 

    setBotsArr((prev) => {
      const newBot =  new BotClass(pos, generateRandomNumber(4), botsData.name, botsData.colorClass, Number(botsData.value) )
      console.log("NEW BOT CREATED", newBot)

      const isUniqueBot = prev.some(
        (bot) =>
          bot.name === newBot.name ||
          bot.colorClass === newBot.colorClass
      );

      if (!isUniqueBot) {
        return [...prev, newBot];
      } 

      return prev
    });    

  };

    addbot(formData);

    setFormData({
      position: 1,
      direction: "",
      tile: "4",
      name: "",
      colorClass: "yellow",
      value: "",
      wins: 0,
      loses: 0,
      isAlive: true,
    });
    
  };

  const [expandedBots, setExpandedBots] = useState([]);

  const toggleBotExpansion = (index) => {
    setExpandedBots((prevExpandedBots) => {
      const newExpandedBots = [...prevExpandedBots];
      newExpandedBots[index] = !newExpandedBots[index];
      return newExpandedBots;
    });
  };



  return (
    <>
      <h2>Create Bot</h2>
      <div className="createdBots">
        {botsArr && botsArr.map((bot, index) => (
          <div className="showBot" key={index}>
            <img src={singleBot} alt="photo of a robot head" />
            <div key={index}>
              <h3 className="title">{bot.name}</h3>
              {expandedBots[index] ? (
                <>
                  <p>Value: {bot.value}</p>
                  <p>Operator: {bot.operator}</p>
                  <p>Speed: {bot.speed}</p>
                  <p>Direction: {bot.direction}</p>
                </>
              ) : null}
            </div>
            <button
              className={`expandButton ${
                expandedBots[index] ? "expanded" : ""
              }`}
              onClick={() => toggleBotExpansion(index)}
            >
              <span className="arrow"></span>
            </button>
            <button>Edit</button>
            <button
              className="delete"
              onClick={() => props.deleteBotFromArray(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="test">
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="name">
              Name your bot:
              <input
                type="text"
                id="name"
                name="name"
                value={botsData.name}
                onChange={handleChange}
                required
              />
            </label>
            {!isValid? <p style={{color: "red" }}> * No Two Robots can have same names</p>   :""}
            {/* {!isValid? (e)=>{

              
            }: ""} */}
            <div></div>
            <label htmlFor="value">
              Choose a Boolean Value:
              <select
                id="value"
                name="value"
                value={botsData.value}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a Value</option>
                <option value="1">1</option>
                <option value="0">0</option>
              </select>
            </label>

            <label htmlFor="colorClass">Bot Color</label>
            <input
              type="color"
              id="colorClass"
              name="colorClass"
              value={botsData.colorClass}
              onChange={handleChange}
              required
            />
            <label htmlFor="botSpeed">
              Choose Speed:
              <input
                id="botSpeed"
                type="range"
                min={1}
                max={100}
                name='botSpeed'
                value={formData.botSpeed}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="direction">
              Bot Direction:
              <select
                id="direction"
                name="direction"
                value={botsData.direction}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a Direction</option>
                <option value="1">NORTH</option>
                <option value="2">SOUTH</option>
                <option value="4">EAST</option>
                <option value="3">WEST</option>
              </select>
            </label>
            <button type="submit">Add Bot</button>
          </fieldset>
        </form>
        <Link to="/arena">
          <button>Battle Ground</button>
        </Link>
      </div>
    </>
  );
}