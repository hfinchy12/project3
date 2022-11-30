import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import TextField from '@mui/material/Textfield';
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import './css/CustomerCheckout.css';
import apiClient from './services/apiClient.js';
/**
 * This function displays all the menu items chosen by the user in the final cart.
 * @returns All the menu items that were selected by the user are displayed in the cart on the second page, next to the pay button
 */
const CustomerCheckout = () => {

    const api = apiClient;
    let inventory = null;

    const navigate = useNavigate()
    const location = useLocation();
    const from = location.state;

    const [ customerName, setCustomerName ] = useState("");
    const baseIds = ["Grain Bowl", "Salad", "Pita", "Greens and Grains"];
    const proteinIds = ["Gyro", "Falafel", "Vegetable Medley", "Meatballs", "Chicken"];
    const starterIds = ["2 Falafels", "Hummus and Pita", "Vegan Box", "Garlic Fries"];
    const [ cartItems, setCartItems ] = useState(null);
    const [ cartItemsPage, setCartItemsPage ] = useState(1);
    const [ orderSuccess, setOrderSuccess ] = useState(null);

    const addOrder = async orders => {
        const { data, error } = await api.addOrder(orders);
        if (error === null) {
            setOrderSuccess(true);
        } else {
            setOrderSuccess(false);
        }
        await console.log(data, error);
    };

    const changeCustomerName = (e) => {
        setCustomerName(e.target.value);
    };

    const changeCartItemsPage = (e) => {
        setCartItemsPage(parseInt(e.target.innerHTML[0]));
    };

    const showCartItems = () => {
        const starters = from.starters;
        const bases = from.bases;
        let cartItemsArr = [...starters, ...bases];
        let items = null;
        let arrayOfArrays = [];
        let cartItemsPages = [];
        for (let i = 0; i < cartItemsArr.length; i += 2) {
            arrayOfArrays.push(cartItemsArr.slice(i, i + 2));
        }

        cartItemsPages = arrayOfArrays;
        console.log(cartItemsPages)

        if (cartItemsPages.length > 0) {
            items = (cartItemsPages[cartItemsPage - 1].map((item) => {
                if (item.base === undefined) {
                    return (<Card
                        sx = {{
                            width: 300,
                            height: 100,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 5,
                            backgroundColor: '#F5FFFA'
                        }}    
                    >
                        <label>{item}</label>
                    </Card>);
                } else {
                    return (<Card
                        sx = {{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 300,
                            height: 180,
                            marginTop: 5,
                            backgroundColor: '#F5FFFA'
                        }}    
                    >
                        <label>Base: {item.base}</label>
                        <label>Protein: {item.protein}</label>
                        {item.toppings !== '' ?
                            <label>Toppings: {item.toppings}</label> : <label>Toppings: None</label>
                        }
                        {item.dressings !== '' ?
                            <label>Dressings: {item.dressings}</label> : <label>Dressings: None</label>
                        }
                    </Card>);
                }
            }));
        }

        setCartItems(
            <div className='cart-items' >
                {items}
                {(cartItemsPages.length === 0) ? null : <Pagination hidePrevButton={true} hideNextButton={true} count={cartItemsPages.length} page={cartItemsPage} 
                    onChange={changeCartItemsPage} color="primary" />
                }
            </div>
        );
    };

    const submitData = () => {
        let orders = null;
        let orderItems = [];

        from.cartItems.map((item) => {
            (item.base === undefined) ? 
                orderItems.push({
                    "isCombo"   : false,
                    "starterId" : String(starterIds.indexOf(item) + 1),
                    "baseId"    : "",
                    "proteinId" : ""
                }) : 
                orderItems.push({
                    "isCombo"   : false,
                    "starterId" : '',
                    "baseId"    : String(baseIds.indexOf(item.base) + 1),
                    "proteinId" : String(proteinIds.indexOf(item.protein) + 1)
                });
        });

        orders = {
            "employeeId": "1",
            "items": orderItems
        }
        console.log(orders);
        addOrder(orders);
    };

    useEffect(() => {
        if (from.cartItems !== 'undefined') {
            showCartItems();
        }
    }, [location.state, cartItemsPage]);

    useEffect(() => {
        if (orderSuccess !== null) {
            setTimeout(function () {
                navigate('/');
            }, 2000);
        }
    }, [orderSuccess]);

    return (
        <div className='customer-checkout' >
            <div className='checkout-area' >
                <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: 570,
                        height: 650,
                        backgroundColor: '#FFFAF0'
                    }}
                >
                    <label className='checkout-area-title' >Review Checkout</label>
                    {cartItems}
                    {from.combo === true ?
                        <label>+ Combo</label> : null
                    }
                    <label className='checkout-area-total' >Total: {from.cost}</label>
                </Card>
            </div>
            <div className='not-checkout-area' >
                <div className='customer-name-entry-box' >
                    <TextField id='customer-name-entry' label='Enter Name' variant='outlined' margin='normal' onChange={changeCustomerName} />
                </div>
                <div className='checkout-button' >
                    <Button variant='outlined' margin='normal' onClick={submitData} >Pay</Button>
                </div>
                {(orderSuccess !== null) ? ((orderSuccess === true) ? 
                    <div className='submit-alert' >
                        <Alert severity="success">
                            <AlertTitle>Success</AlertTitle>
                            Order Successful!
                        </Alert>
                    </div> :
                    <div className='submit-alert' >
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            Order Failed
                        </Alert>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default CustomerCheckout;