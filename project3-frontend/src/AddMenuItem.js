import React, {useState } from 'react';
import TextField from '@mui/material/Textfield';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import apiClient from './services/apiClient';
import './css/AddMenuItem.css';

/**
 * This function allows the user to add an item to the Menu using the frontend.
 * @returns the updated menu to the frontend
 */
const AddMenuItem = () => {
    
    const api = apiClient; // apiClient is a singleton

    const [ name, setName ] = useState('');
    const [ quantity, setQuantity ] = useState(0);
    const [ price, setPrice ] = useState(0.0);
    const [ itemType, setItemType ] = useState('');

    const createMenuItem = async () => {
        const item = {
            name: name,
            quantity: parseInt(quantity),
            price: parseFloat(price)
        };
        console.log(item);
        const { data, error } = await api.createMenuItem(itemType, item);
    };

    const changeItemName = (e) => { // change item name
        setName(e.target.value); // set name
    };

    const changeItemQuantity = (e) => { // change item quantity
        setQuantity(e.target.value); // set quantity
    };

    const changeItemPrice = (e) => {
        setPrice(e.target.value);
    };

    const changeItemType = (e) => {
        setItemType(e.target.value);
    };

    const submitData = () => {
        createMenuItem();
    };
    
    return (
        <div className='add-menu-item' >  
            <label style={{fontSize: 'x-large'}} className='add-menu-item-title' >Add Menu Item</label> 
            <TextField id='item-type-entry' label='Enter Item Type' variant='outlined' margin='normal' onChange={changeItemType} />
            <div className='item-textfields' > 
                <TextField id='item-name-entry' label='Enter Item Name' variant='outlined' margin='normal' onChange={changeItemName} />
                <TextField id='item-quantity-entry' label='Enter Item Quantity' variant='outlined' margin='normal' onChange={changeItemQuantity} />
                <TextField id='item-price-entry' label='Enter Item Price' variant='outlined' margin='normal' onChange={changeItemPrice} />
            </div>
            <Link
                to={{
                    pathname: '/manager/menu' // go to inventory

                }}
            >
                <Button variant='outlined' margin='normal' onClick={submitData} >Submit</Button> 
            </Link>
        </div>
    );
};

export default AddMenuItem;