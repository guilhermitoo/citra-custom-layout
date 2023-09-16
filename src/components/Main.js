'use client'

import { useState, useEffect } from "react";
import CenteredDiv from "./CenteredDiv";
import GameScreen1 from "./GameScreen";
import GameScreen2 from "./GameScreen";

export default function Main() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    
    // Main Screen
    const [MSLeft, setMSLeft] = useState(0);
    const [MSTop, setMSTop] = useState(0);    
    const [MSWidth, setMSWidth] = useState(0);
    const [MSHeight, setMSHeight] = useState(0);   
    // Second Screen
    const [SSLeft, setSSLeft] = useState(0);    
    const [SSTop, setSSTop] = useState(0);
    const [SSWidth, setSSWidth] = useState(0);
    const [SSHeight, setSSHeight] = useState(0);      

    const [percent, setPercent] = useState(60);

    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState(''); 
    
    const [convertedObject, setConvertedObject] = useState({});
    const [resultingObject, setResultingObject] = useState({});

    const [selectedResolution, setSelectedResolution] = useState(-1);
    const [selectedLayout, setSelectedLayout] = useState(-1);

    const resolutions = [{width: 1280, height: 720, percent: 60},
                         {width: 1280, height: 800, percent: 65},
                         {width: 1344, height: 750, percent: 65},
                         {width: 1920, height: 1080,percent: 50},
                         {width: 3840, height: 2160,percent: 28}];

    useEffect(() => {
        if (selectedResolution == -1) {
            setSelectedResolution(0);
        }
    },[]);

    useEffect(() => {
        if (selectedResolution == -1) {
            return
        }
        if (resolutions[selectedResolution].hasOwnProperty("width")) {
            setWidth(resolutions[selectedResolution].width);
            setHeight(resolutions[selectedResolution].height);
            setPercent(resolutions[selectedResolution].percent);
        }
    },[selectedResolution]);    

    useEffect(() => {
        if (selectedLayout == -1) {
            return
        }
        switch (selectedLayout) {
            case "0":
                configureSideBySide();
                break;
            case "1":
                configureTopBottom();
                break;
            case "2":
                configureBigSmall();
                break;
        }
    },[selectedLayout]);    

    function configureSideBySide() {
        setMSWidth(parseInt(width/2));
        setMSHeight(parseInt(height/2));
        setMSLeft(0);
        setMSTop(parseInt(height/4));

        setSSWidth(parseInt(width/2));
        setSSHeight(parseInt(height/2));
        setSSLeft(parseInt(width/2));
        setSSTop(parseInt(height/4));
    }

    function configureTopBottom() {
        setMSWidth(parseInt(width/2));
        setMSHeight(parseInt(height/2));
        setMSLeft(parseInt(width/4));
        setMSTop(0);

        setSSWidth(parseInt(width/2));
        setSSHeight(parseInt(height/2));
        setSSLeft(parseInt(width/4));
        setSSTop(parseInt(height/2));
    }

    function configureBigSmall() {
        setMSWidth(parseInt(width/1.5));
        setMSHeight(parseInt(height/1.2));
        setMSLeft(0);
        setMSTop(parseInt(height/7));

        setSSWidth(parseInt(width/3));
        setSSHeight(parseInt(height/2));
        setSSLeft(parseInt(width/1.5));
        setSSTop(parseInt(height/2.11));
    }

    useEffect(() => {
        loadCustomLayout();
    },[convertedObject]);
    
    useEffect(() => {resultingObject.custom_top_left = MSLeft},[MSLeft]);
    useEffect(() => {resultingObject.custom_top_top = MSTop},[MSTop]);
    useEffect(() => {resultingObject.custom_top_right = parseInt(MSLeft)+parseInt(MSWidth)},[MSWidth,MSLeft]);
    useEffect(() => {resultingObject.custom_top_bottom = parseInt(MSTop)+parseInt(MSHeight)},[MSHeight,MSTop]);

    useEffect(() => {resultingObject.custom_bottom_left = SSLeft},[SSLeft]);
    useEffect(() => {resultingObject.custom_bottom_top = SSTop},[SSTop]);
    useEffect(() => {resultingObject.custom_bottom_right = parseInt(SSLeft)+parseInt(SSWidth)},[SSWidth,SSLeft]);
    useEffect(() => {resultingObject.custom_bottom_bottom = parseInt(SSTop)+parseInt(SSHeight)},[SSHeight,SSTop]);            

    const handleConvertClick = () => {
        try {
            // Converter o texto de entrada em um objeto JavaScript
            const keyValuePairs = inputText.split('\n').map(line => {
            const [key, value] = line.split('=').map(item => item.trim());
            return { [key]: parseInt(value) };
            });
            
            const cObj = Object.assign({}, ...keyValuePairs);
            
            setConvertedObject(cObj);
        } catch (error) {
            setOutputText('Erro na conversão.');
        }
    };

    function loadCustomLayout() {
        setMSLeft(convertedObject.custom_top_left);
        setMSTop(convertedObject.custom_top_top);
        setMSWidth(convertedObject.custom_top_right-convertedObject.custom_top_left);
        setMSHeight(convertedObject.custom_top_bottom-convertedObject.custom_top_top);

        setSSLeft(convertedObject.custom_bottom_left);
        setSSTop(convertedObject.custom_bottom_top);
        setSSWidth(convertedObject.custom_bottom_right-convertedObject.custom_bottom_left);
        setSSHeight(convertedObject.custom_bottom_bottom-convertedObject.custom_bottom_top);
    }

    function saveCustomLayout() {
        setOutputText("");        

        let sObj = Object.entries(resultingObject).map(([chave, valor]) => `${chave}=${valor}`).join('\n');

        setOutputText(sObj);        
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(outputText);
    };

    return (
        <main class="flex min-h-screen flex-col items-center bg-gray-700">
            <div class="flex w-full bg-gray-600 shadow drop-shadow-md">
                <div class="w-auto h-auto p-2 m-2 border-2 rounded-lg border-gray-400">
                    <p class="mb-2 text-center">Input</p>
                    <textarea class="text-black rounded h-48 w-64 resize-none" rows="10" cols="40"
                        placeholder="paste custom layout here" value={inputText} onChange={(e) => setInputText(e.target.value)}
                    />                    
                </div>
                <button class="bg-gray-500 px-2 hover:bg-gray-400 cursor-pointer rounded drop-shadow my-24 w-24" onClick={handleConvertClick}>Load</button>                
                <div class="w-auto h-auto p-2 m-2 border-2 rounded-lg border-gray-400">
                    <p class="mb-2 text-center">Device Resolution</p>
                    <div class="mb-2 flex flex-row">
                        <p class="w-24 p-1">Resolution</p>
                        <select class="rounded p-1 text-black w-48"
                            id="resolutionSelect"
                            value={selectedResolution}
                            onChange={(e) => setSelectedResolution(e.target.value)}>
                            <option value="0">HD (1280 x 720)</option>
                            <option value="1">SteamDeck (1280 x 800)</option>
                            <option value="2">RP3+ (1344 x 750)</option>
                            <option value="3">Full HD (1920 x 1080)</option>
                            <option value="4">4K (3840 x 2160)</option>
                        </select>
                    </div>
                    <div class="mb-2 flex flex-row">
                        <p class="w-24 p-1">Layouts</p>
                        <select class="rounded p-1 text-black w-48"
                            id="resolutionSelect"
                            value={selectedLayout}
                            onChange={(e) => setSelectedLayout(e.target.value)}>
                            <option value="-1">Select...</option>
                            <option value="0">Side-by-Side</option>
                            <option value="1">Top-Bottom</option>
                            <option value="2">Big and Small</option>
                        </select>
                    </div>                    
                    <div class="mb-2 flex flex-row">
                        <p class="w-24 p-1">Width</p>
                        <input class="rounded p-1 text-black w-48" type="number" value={width} onChange={(e) => setWidth(e.target.value)}/>
                    </div>
                    <div class=" flex flex-row">
                        <p class="w-24 p-1">Height</p>
                        <input class="rounded p-1 text-black w-48" type="number" value={height} onChange={(e) => setHeight(e.target.value)}/>                
                    </div>
                </div>

                <div class="w-auto h-auto p-2 m-2 border-2 rounded-lg border-gray-400">
                    <p class="mb-2 text-center rounded-lg bg-blue-500">First Screen</p>
                    <div class="mb-2  flex flex-row">
                        <p class="w-16 p-1">Left</p>
                        <input class="rounded p-1 text-black w-36" type="number" value={MSLeft} onChange={(e) => setMSLeft(e.target.value)}/>                
                    </div>                    
                    <div class="mb-2 flex flex-row">
                        <p class="w-16 p-1">Top</p>
                        <input class="rounded p-1 text-black w-36" type="number" value={MSTop} onChange={(e) => setMSTop(e.target.value)}/>
                    </div>
                    <div class="mb-2  flex flex-row">
                        <p class="w-16 p-1">Width</p>
                        <input class="rounded p-1 text-black w-36" type="number" value={MSWidth} onChange={(e) => setMSWidth(e.target.value)}/>                
                    </div>                    
                    <div class=" flex flex-row">
                        <p class="w-16 p-1">Height</p>
                        <input class="rounded p-1 text-black w-36" type="number" value={MSHeight} onChange={(e) => setMSHeight(e.target.value)}/>                
                    </div>                      
                </div>

                <div class="w-auto h-auto p-2 m-2 border-2 rounded-lg border-gray-400">
                    <p class="mb-2 text-center rounded-lg bg-red-500">Second Screen</p>
                    <div class="mb-2  flex flex-row">
                        <p class="w-16 p-1">Left</p>
                        <input class="rounded p-1 text-black w-36" type="number" value={SSLeft} onChange={(e) => setSSLeft(e.target.value)}/>                
                    </div>                    
                    <div class="mb-2 flex flex-row">
                        <p class="w-16 p-1">Top</p>
                        <input class="rounded p-1 text-black w-36" type="number" value={SSTop} onChange={(e) => setSSTop(e.target.value)}/>
                    </div>
                    <div class="mb-2  flex flex-row">
                        <p class="w-16 p-1">Width</p>
                        <input class="rounded p-1 text-black w-36" type="number" value={SSWidth} onChange={(e) => setSSWidth(e.target.value)}/>                
                    </div>                    
                    <div class=" flex flex-row">
                        <p class="w-16 p-1">Height</p>
                        <input class="rounded p-1 text-black w-36" type="number" value={SSHeight} onChange={(e) => setSSHeight(e.target.value)}/>                
                    </div>                      
                </div>
                <button class="bg-gray-500 px-2 hover:bg-gray-400 cursor-pointer rounded drop-shadow my-24 w-24" onClick={saveCustomLayout}>Prepare</button>
                <div class="w-auto h-auto p-2 m-2 border-2 rounded-lg border-gray-400">
                    <p class="mb-2 text-center">Output</p>
                    <textarea class="text-black rounded h-48 w-64 resize-none bg-gray-100" readOnly="true" rows="10" cols="40"
                        placeholder="result." value={outputText}/>
                    <button class="bg-gray-500 px-2 hover:bg-gray-400 cursor-pointer rounded drop-shadow mx-1" onClick={handleCopyToClipboard}>Clipboard</button>
                    
                </div>
            </div>
            <div class="flex flex-row m-4">
                <button class="bg-gray-500 px-2 hover:bg-gray-400 cursor-pointer rounded drop-shadow mx-2" onClick={() => {setPercent(percent-1)}}>-</button>
                <p>{percent} %</p>
                <button class="bg-gray-500 px-2 hover:bg-gray-400 cursor-pointer rounded drop-shadow mx-2" onClick={() => {setPercent(percent+1)}}>+</button>
            </div>
            <div>
                <CenteredDiv width={width*(percent/100)} height={height*(percent/100)} >
                    <GameScreen1 className={"bg-blue-500"} width={MSWidth*(percent/100)} height={MSHeight*(percent/100)} marginTop={MSTop*(percent/100)} marginLeft={MSLeft*(percent/100)} />    
                    <GameScreen2 className={"bg-red-500"} width={SSWidth*(percent/100)} height={SSHeight*(percent/100)} marginTop={SSTop*(percent/100)} marginLeft={SSLeft*(percent/100)} />    
                </CenteredDiv>
                
            </div>
        </main>
    )
}