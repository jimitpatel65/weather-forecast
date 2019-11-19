import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import './searchbar.css';

export default function SearchBar(props) {
    return (
        <div className="search-bar">
            <input 
                type="text"
                className="search-box" 
                placeholder="Enter zip code or full address and press Enter..."
                onKeyPress = {(e) => {
                    if(e.key === 'Enter'){
                        props.getWeatherInfo(e.target.value);
                    }
                }}>
                </input>
                <SearchIcon className="search-btn"/>
        </div>
    );
};