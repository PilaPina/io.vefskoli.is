'use client'
import {useState, useEffect } from 'react'
import { MainContent } from "../mainLayout"
import { FilledButton } from "../buttons"
import { TopContainer, Title, DropdownContainer, GuidesContainer, ModuleTitle } from "../guides/styles"
import DropdownResources from "../dropDown/dropDownResource"
import Modal from "../modal/modal"

//Defining type for the data prop in the Recordings component. 
type Props = {
    data: {
        meetings: {
            recording_files:{
                download_url:string
                file_type: string
            }[]
            topic:string 
        }[];
    };
};


// This object maps the first 8 characters of a video title to a more user-friendly name for the dropdown menu.
// This can be adjusted at will when new naming convention for videos has been implemented or however smari and jakub want it. :)
const nameDrop: {[key:string]:string} = {
    'Module 1' : 'MODULE 1',
    'Module 2' : 'MODULE 2',
    'Module 3' : 'MODULE 3',
    'Module 4' : 'MODULE 4',
    'Module 5' : 'MODULE 5',
    'Module 6' : 'MODULE 6',
    'Las palm' : 'LAS PALMAS',
    'Talk abo' : 'LAS PALMAS',
    'Introduc' : 'INTRO',
    'JavaScri' : 'MODULE 3',
    'Github B' : 'GITHUB',
    'About th' : 'GITHUB',
    'TypeScri' : 'MODULE 3',
    'Final pr' : 'MODULE 4',
    'Lecture ' : 'MODULE 3',
    'Steinar ' : 'GUESTS',
    'Anna Sig' : 'GUESTS',
    'React fe' : 'MODULE 4',
    'React St' : 'MODULE 4',
    'React Pr' : 'MODULE 4',
    'Vefskóli' : 'MISC',
    'Presenta'  : 'GUESTS',
    'Web appl' : 'MODULE 3',
    'Returnin' : 'MISC',  
}; 

//Our component that displays the zoom recordings. 
const Recordings =  ({ data}: Props) => {
    
    // These are the state variables for the dropdown options and the currently selected option.
    const [options, setOptions] = useState(['']);
    const [selectedOption, setSelectedOption] = useState('ALL VIDEOS');

    // This effect runs when the data prop changes. It updates the dropdown options based on the video titles.
    useEffect (() => {     
        // Define options for the dropdown. Set is used to ensure that only unique values are present in optionsSet
        // This filters by the first 8 digits from 'topic' in our database. 
        const optionsSet = new Set(data.meetings.map(recording => nameDrop[recording.topic.substring(0, 8)] || recording.topic.substring(0, 8)));  
        const options:string[] = Array.from(optionsSet);   //Array.from() is used to convert the Set back into an array which can be used as the options for dropdown. This will ensure that each module only appears once in the dropdown, regardless of how many videos it has.  
        options.push('ALL VIDEOS')
        // This converts the Set back into an array and adds the 'ALL VIDEOS' option.
        setOptions (options)
    }
    , [data]);


    return (
        <MainContent>
            <TopContainer>
            <DropdownContainer>
                <DropdownResources options={options} onChange={setSelectedOption} /> 
                <ModuleTitle>Resources</ModuleTitle>  
            </DropdownContainer>
            </TopContainer>
            <Title style={{fontSize: '30px'}}>Recordings</Title>
            <a href="https://drive.google.com/drive/folders/1EZreV5U-Xubx2bVdZ6ULDQaazAgeGvKW?usp=sharing" target="_blank" rel="noopener"><FilledButton>Drive</FilledButton></a>  
            <GuidesContainer> {data.meetings.filter((meeting) => selectedOption ==='ALL VIDEOS' || nameDrop[meeting.topic.substring(0,8)] == selectedOption).map((meeting) => {
                return (
                    <Modal ZoomVideo= {meeting}/> 
                )
            })} </GuidesContainer>
        </MainContent>
    )
};

export default Recordings 

//The GuidesContainer has props that map over the meetings data and filters it based on the selected option. It then renders a Modal component for each meeting.
// The Modal contains the selected videos and ZoomVideos are playable therein. 